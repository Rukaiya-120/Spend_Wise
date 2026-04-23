<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Balance\RecordSettlementRequest;
use App\Models\ContextMember;
use App\Services\SettlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BalanceController extends Controller
{
    public function __construct(private SettlementService $settlementService) {}

    /**
     * GET /api/balances/summary?context_id=xxx
     * FR-BA-02: Balance summary showing who owes whom.
     */
    public function summary(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
        ]);

        $this->ensureActiveMember($request->context_id);

        $summary = $this->settlementService->getBalanceSummary(
            $request->context_id,
            Auth::user()
        );

        return response()->json($summary);
    }

    /**
     * POST /api/balances/settlements
     * FR-BA-03 / FR-BA-04: Record a settlement and update balance atomically.
     */
    public function recordSettlement(RecordSettlementRequest $request): JsonResponse
    {
        $this->ensureActiveMember($request->context_id);

        $settlement = $this->settlementService->record(Auth::user(), $request->validated());

        return response()->json([
            'message'    => 'Settlement recorded successfully.',
            'settlement' => $settlement,
        ], 201);
    }

    /**
     * GET /api/balances/settlements?context_id=xxx
     * FR-BA-05: Full settlement history for the context.
     */
    public function settlementHistory(Request $request): JsonResponse
    {
        $request->validate([
            'context_id' => ['required', 'uuid', 'exists:contexts,id'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $this->ensureActiveMember($request->context_id);

        $history = $this->settlementService->getHistory(
            $request->context_id,
            $request->per_page ?? 20
        );

        return response()->json($history);
    }

    // ─── Helper ──────────────────────────────────────────────────────────

    private function ensureActiveMember(string $contextId): void
    {
        $isMember = ContextMember::where('context_id', $contextId)
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->exists();

        abort_if(!$isMember, 403, 'You do not have access to this context.');
    }
}