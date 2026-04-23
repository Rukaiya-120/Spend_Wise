<?php

namespace App\Http\Controllers\Budget;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Models\Budget;
use App\Models\ContextMember;
use App\Services\BudgetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function __construct(private BudgetService $budgetService) {}

    /**
     * GET /api/budgets?context_id=xxx&month=1&year=2025
     * FR-BU-03: Return budgets with consumed % for the month.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
            'month'      => ['required', 'integer', 'between:1,12'],
            'year'       => ['required', 'integer', 'min:2000', 'max:2100'],
        ]);

        $this->ensureActiveMember($request->context_id);

        $budgets = $this->budgetService->getBudgetsWithProgress(
            $request->context_id,
            (int) $request->month,
            (int) $request->year
        );

        return response()->json([
            'month'   => $request->month,
            'year'    => $request->year,
            'budgets' => $budgets,
        ]);
    }

    /**
     * POST /api/budgets
     * FR-BU-01 / FR-BU-02: Set overall or category budget.
     */
    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $this->ensureCanManage($request->context_id);

        $budget = $this->budgetService->store($request->validated());

        return response()->json([
            'message' => 'Budget set successfully.',
            'budget'  => $budget->load('category:id,name,icon'),
        ], 201);
    }

    /**
     * PUT /api/budgets/{budget}
     * Update budget amount only (month/year/context cannot change — delete and recreate instead).
     */
    public function update(UpdateBudgetRequest $request, Budget $budget): JsonResponse
    {
        $this->ensureCanManage($budget->context_id);

        $budget = $this->budgetService->update($budget, (float) $request->amount);

        return response()->json([
            'message' => 'Budget updated successfully.',
            'budget'  => $budget,
        ]);
    }

    /**
     * DELETE /api/budgets/{budget}
     */
    public function destroy(Budget $budget): JsonResponse
    {
        $this->ensureCanManage($budget->context_id);

        $this->budgetService->delete($budget);

        return response()->json(['message' => 'Budget deleted.']);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    private function ensureActiveMember(string $contextId): void
    {
        abort_if(
            !ContextMember::where('context_id', $contextId)
                ->where('user_id', Auth::id())
                ->where('status', 'active')
                ->exists(),
            403,
            'You do not have access to this context.'
        );
    }

    private function ensureCanManage(string $contextId): void
    {
        $member = ContextMember::where('context_id', $contextId)
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->with('context:id,type')
            ->first();

        abort_if(!$member, 403, 'You are not a member of this context.');

        $isPersonal  = $member->context->type === 'personal';
        $isGroupAdmin = $member->role === 'admin';

        abort_if(
            !$isPersonal && !$isGroupAdmin,
            403,
            'Only group admins can manage group budgets.'
        );
    }
}