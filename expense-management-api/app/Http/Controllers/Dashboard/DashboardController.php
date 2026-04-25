<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Context;
use App\Models\ContextMember;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    /**
     * GET /api/dashboard
     * FR-DA-01 / FR-DA-02: Returns personal or group dashboard based on context type.
     *
     * Query params:
     *   context_id  (required)
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
        ]);

        $context = Context::findOrFail($request->context_id);
        $user    = Auth::user();

        $this->ensureActiveMember($context->id);

        $data = match($context->type) {
            'personal' => $this->dashboardService->getPersonalDashboard($user, $context),
            'group'    => $this->dashboardService->getGroupDashboard($user, $context),
        };

        return response()->json($data);
    }

    /**
     * GET /api/dashboard/chart
     * FR-DA-03: Category-breakdown chart data for a specific month.
     *
     * Query params:
     *   context_id  (required)
     *   month       (required, 1–12)
     *   year        (required)
     */
    public function chart(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
            'month'      => ['required', 'integer', 'between:1,12'],
            'year'       => ['required', 'integer', 'min:2000', 'max:2100'],
        ]);

        $this->ensureActiveMember($request->context_id);

        $chartData = $this->dashboardService->getChartData(
            $request->context_id,
            (int) $request->month,
            (int) $request->year
        );

        return response()->json($chartData);
    }

    /**
     * GET /api/dashboard/activity
     * FR-DA-04: Activity log feed for the context.
     *
     * Query params:
     *   context_id  (required)
     *   per_page    (optional, default 20)
     */
    public function activity(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $this->ensureActiveMember($request->context_id);

        $feed = $this->dashboardService->getActivityFeed(
            $request->context_id,
            (int) ($request->per_page ?? 20)
        );

        return response()->json($feed);
    }

    // ─── Helper ──────────────────────────────────────────────────────────

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
}
