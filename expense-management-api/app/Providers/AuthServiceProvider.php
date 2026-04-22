<?php

namespace App\Providers;

use App\Models\Context;
use App\Policies\ContextPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Context::class => ContextPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
