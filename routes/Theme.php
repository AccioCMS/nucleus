<?php

/**
 * Theme Routes
 */

Route::group(
    ['middleware' => ['auth:api'], 'as' => 'backend.theme.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {
    }
);
