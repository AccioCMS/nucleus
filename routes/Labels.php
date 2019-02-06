<?php

/**
 * Post Types Routes
 */

Route::group(
    ['as' => 'backend.postType.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {

    Route::group(['middleware' => ['auth:api']], function (){
        Route::get('/json/labels/{module}', 'LabelController@getLabelsByModule')->name('getLabelsByModule');
    });

});
