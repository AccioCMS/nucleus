<?php

/**
 * Menu Routes
 */

Route::group(
    ['middleware' => ['auth:admin'], 'as' => 'backend.menu.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {
        /**
         * GET
         */
        Route::get('/{lang}/menu/{view}', 'MenuController@index')->name('index');
        Route::get('/{lang}/menu/{view}/{menuID}', 'MenuController@single')->name('single');
        Route::get('/{lang}/json/menu/get-all', 'MenuController@getAll')->name('getAll');
        Route::get('/{lang}/json/menu/details/{id}', 'MenuController@detailsJSON')->name('detailsJSON');
        Route::get('/{lang}/menuLinkPanels', 'MenuController@menuLinkPanels')->name('menuLinkPanels');
        Route::get('/{lang}/menu/delete/{menuID}', 'MenuController@deleteMenu')->name('deleteMenu');

        /**
         * POST
         */
        Route::post('/json/menu/store', 'MenuController@store')->name('store');
    }
);