<?php

/**
 * User Routes
 */

//Route::get('test/users/{any}', function(){
//    return view('index');
//});
//
//Route::get('test/users/edit/{any}', function(){
//    return view('index');
//});

Route::group(
    ['as' => 'backend.user.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {

        Route::get('{lang}/user/{view}', 'UserController@index')->name('index');


        Route::get('{lang}/user/{view}/{id}', 'UserController@single')->name('single');

        Route::group(['middleware' => ['auth:api']], function(){
            /**
             * GET
             */

            //get all pagginate
            Route::get('/{lang}/json/user/get-all/{page}/{size}', 'UserController@getAllPagginated')->name('getAllPagginated');

            Route::get('/{lang}/json/user/get-all', 'UserController@getAll')->name('getAll');

            //get all ordered
            Route::get('/{lang}/json/user/get-all/{orderby}/{type}', 'UserController@getAll')->name('getAll');



            Route::any('/{lang}/user/get/{id}','UserController@detailsJSON')->name('detailsJSON');

            Route::any('/api/user/store', '\App\Http\Controllers\Backend\UserController@store')->name('store');

            Route::any('/{lang}/user/storeUpdate', 'UserController@storeUpdate')->name('storeUpdate');

            Route::get('/api/json/user/delete/{lang}/{id}', '\App\Http\Controllers\Backend\UserController@delete')->name('delete');

            Route::get('{lang}/user/search/{term}', 'UserController@search')->name('search');
            Route::get('{lang}/user/search-advanced', 'UserController@searchAdvanced')->name('searchAdvanced');
            Route::get('json/search/user/{term}', 'UserController@makeSearch')->name('makeSearch');


//            Route::get('{lang}/user/{view}/{id}', 'UserController@single')->name('single');

//            Route::get('{lang}/json/user/get-all', 'UserController@getAll')->name('getAll');
            Route::get('{lang}/json/user/get-groups', 'UserController@getGroups')->name('getGroups');
            Route::get('{lang}/json/user/advancedSearch', 'UserController@getAdvancedSearchFields')->name('getAdvancedSearchFields');
            Route::get('{lang}/json/user/delete/{id}', 'UserController@delete')->name('delete');
            Route::get('{lang}/json/user/details/{id}', 'UserController@detailsJSON')->name('detailsJSON');
            Route::get('{lang}/json/user/get-all-without-pagination', 'UserController@getAllWithoutPagination')->name('getAllWithoutPagination');

            /**
             * POST
             */

            Route::post('/json/user/store', 'UserController@store')->name('store');
            Route::post('/json/user/storeUpdate', 'UserController@c')->name('storeUpdate');
            Route::post('/json/user/bulk-delete', 'UserController@bulkDelete')->name('bulkDelete');
            Route::post('/json/user/resetPassword', 'UserController@resetPassword')->name('resetPassword');
            Route::post('/json/user/advanced-search-results', 'UserController@getAdvancedSearchFieldsResults')->name('getAdvancedSearchFieldsResults');
        });

    }
);
