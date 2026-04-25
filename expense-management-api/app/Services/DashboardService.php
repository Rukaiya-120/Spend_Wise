<?php

namespace App\Services;

use App\Models\Balance;
use App\Models\Budget;
use App\Models\Context;
use App\Models\ContextMember;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(private ActivityLogService $activityLogService) {}

    // ─────────────────────────────────────────────────────────────────────
    // FR-DA-01: Personal Dashboard
    // ─────────────────────────────────────────────────────────────────────
    public function getPersonalDashboard(User $user, Context $context): array
    {
        $now   = now();
        $month = $now->month;
        $year  = $now->year;

        // Total spent this month
        $totalSpentThisMonth = $this->getTotalSpent($context->id, $month, $year);

        // Budget utilization — overall budget for this month
        $overallBudget = Budget::where('context_id', $context->id)
            ->whereNull('category_id')
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        $budgetUtilization = null;
        if ($overallBudget) {
            $budgetAmount      = (float) $overallBudget->amount;
            $budgetUtilization = [
                'budget_amount' => $budgetAmount,
                'spent'         => $totalSpentThisMonth,
                'remaining'     => round($budgetAmount - $totalSpentThisMonth, 2),
                'percentage'    => $budgetAmount > 0
                    ? round(($totalSpentThisMonth / $budgetAmount) * 100, 2)
                    : 0,
                'status'        => $this->getBudgetStatus(
                    $budgetAmount > 0
                        ? ($totalSpentThisMonth / $budgetAmount) * 100
                        : 0
                ),
            ];
        }

        // Top spending categories this month
        $topCategories = $this->getTopCategories($context->id, $month, $year, limit: 5);

        // Recent expenses (last 10)
        $recentExpenses = Expense::with(['category:id,name,icon', 'creator:id,name,avatar_url'])
            ->where('context_id', $context->id)
            ->orderByDesc('expense_date')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Category breakdown for chart (FR-DA-03)
        $categoryBreakdown = $this->getCategoryBreakdown($context->id, $month, $year);

        return [
            'context'               => $context->only('id', 'name', 'type'),
            'month'                 => $month,
            'year'                  => $year,
            'total_spent_this_month'=> $totalSpentThisMonth,
            'budget_utilization'    => $budgetUtilization,
            'top_categories'        => $topCategories,
            'category_breakdown'    => $categoryBreakdown,   // FR-DA-03
            'recent_expenses'       => $recentExpenses,
        ];
    }

    // ─────────────────────────────────────────────────────────────────────
    // FR-DA-02: Group Dashboard
    // ─────────────────────────────────────────────────────────────────────
    public function getGroupDashboard(User $user, Context $context): array
    {
        $now   = now();
        $month = $now->month;
        $year  = $now->year;

        // Group total spent this month
        $groupTotalSpent = $this->getTotalSpent($context->id, $month, $year);

        // Member-wise spending breakdown
        $memberSpending = $this->getMemberSpendingBreakdown($context->id, $month, $year);

        // Outstanding balances
        $outstandingBalances = $this->getOutstandingBalances($context->id, $user);

        // Recent group expenses (last 10)
        $recentExpenses = Expense::with([
                'category:id,name,icon',
                'creator:id,name,avatar_url',
                'splits.user:id,name,avatar_url',
            ])
            ->where('context_id', $context->id)
            ->orderByDesc('expense_date')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Category breakdown for chart (FR-DA-03)
        $categoryBreakdown = $this->getCategoryBreakdown($context->id, $month, $year);

        // Active members count
        $memberCount = ContextMember::where('context_id', $context->id)
            ->where('status', 'active')
            ->count();

        return [
            'context'              => $context->only('id', 'name', 'type'),
            'month'                => $month,
            'year'                 => $year,
            'group_total_spent'    => $groupTotalSpent,
            'member_count'         => $memberCount,
            'member_spending'      => $memberSpending,
            'outstanding_balances' => $outstandingBalances,
            'category_breakdown'   => $categoryBreakdown,   // FR-DA-03
            'recent_expenses'      => $recentExpenses,
        ];
    }

    // ─────────────────────────────────────────────────────────────────────
    // FR-DA-03: Spending Chart Data (category breakdown for any month)
    // ─────────────────────────────────────────────────────────────────────
    public function getChartData(string $contextId, int $month, int $year): array
    {
        $breakdown = $this->getCategoryBreakdown($contextId, $month, $year);

        $totalSpent = collect($breakdown)->sum('amount');

        // Add percentage share to each slice
        $slices = collect($breakdown)->map(function ($item) use ($totalSpent) {
            return [
                'category_id'   => $item['category_id'],
                'category_name' => $item['category_name'],
                'icon'          => $item['icon'],
                'amount'        => $item['amount'],
                'percentage'    => $totalSpent > 0
                    ? round(($item['amount'] / $totalSpent) * 100, 2)
                    : 0,
            ];
        })->values()->toArray();

        return [
            'month'       => $month,
            'year'        => $year,
            'total_spent' => round($totalSpent, 2),
            'slices'      => $slices,
        ];
    }

    // ─────────────────────────────────────────────────────────────────────
    // FR-DA-04: Activity log feed for a context
    // ─────────────────────────────────────────────────────────────────────
    public function getActivityFeed(string $contextId, int $perPage = 20)
    {
        return $this->activityLogService->getFeed($contextId, $perPage);
    }

    // ─────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────

    private function getTotalSpent(string $contextId, int $month, int $year): float
    {
        return (float) Expense::where('context_id', $contextId)
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->whereNull('deleted_at')
            ->sum('amount');
    }

    private function getTopCategories(
        string $contextId,
        int    $month,
        int    $year,
        int    $limit = 5
    ): array {
        return Expense::select(
                'category_id',
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->with('category:id,name,icon')
            ->where('context_id', $contextId)
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->whereNull('deleted_at')
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn($e) => [
                'category' => $e->category,
                'total'    => round((float) $e->total, 2),
                'count'    => $e->count,
            ])
            ->toArray();
    }

    private function getCategoryBreakdown(
        string $contextId,
        int    $month,
        int    $year
    ): array {
        return Expense::select(
                'category_id',
                DB::raw('SUM(amount) as total')
            )
            ->with('category:id,name,icon')
            ->where('context_id', $contextId)
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->whereNull('deleted_at')
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->get()
            ->map(fn($e) => [
                'category_id'   => $e->category_id,
                'category_name' => $e->category?->name ?? 'Uncategorised',
                'icon'          => $e->category?->icon ?? '📦',
                'amount'        => round((float) $e->total, 2),
            ])
            ->toArray();
    }

    private function getMemberSpendingBreakdown(
        string $contextId,
        int    $month,
        int    $year
    ): array {
        // Sum expenses each member personally logged
        return Expense::select(
                'created_by',
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as expense_count')
            )
            ->with('creator:id,name,avatar_url')
            ->where('context_id', $contextId)
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->whereNull('deleted_at')
            ->groupBy('created_by')
            ->orderByDesc('total')
            ->get()
            ->map(fn($e) => [
                'user'          => $e->creator,
                'total_spent'   => round((float) $e->total, 2),
                'expense_count' => $e->expense_count,
            ])
            ->toArray();
    }

    private function getOutstandingBalances(string $contextId, User $viewer): array
    {
        $balances = Balance::with([
                'fromUser:id,name,avatar_url',
                'toUser:id,name,avatar_url',
            ])
            ->where('context_id', $contextId)
            ->where('amount', '!=', 0)
            ->get();

        $result = [];

        foreach ($balances as $balance) {
            $amount = (float) $balance->amount;

            if ($amount > 0) {
                $result[] = [
                    'debtor'      => $balance->fromUser,
                    'creditor'    => $balance->toUser,
                    'amount'      => round($amount, 2),
                    'you_owe'     => $balance->from_user_id === $viewer->id,
                    'owed_to_you' => $balance->to_user_id === $viewer->id,
                ];
            } elseif ($amount < 0) {
                $result[] = [
                    'debtor'      => $balance->toUser,
                    'creditor'    => $balance->fromUser,
                    'amount'      => round(abs($amount), 2),
                    'you_owe'     => $balance->to_user_id === $viewer->id,
                    'owed_to_you' => $balance->from_user_id === $viewer->id,
                ];
            }
        }

        return $result;
    }

    private function getBudgetStatus(float $percentage): string
    {
        return match(true) {
            $percentage >= 100 => 'exceeded',
            $percentage >= 80  => 'warning',
            default            => 'on_track',
        };
    }
}
