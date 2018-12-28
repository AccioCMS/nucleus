<?php

namespace Accio\Search;

use Accio\Routing\MainController;
use Accio\Support\Facades\Search;

class BaseSearchController extends MainController
{
    /**
     * Used as a general method for searching with term.
     *
     * @param  string $tableName
     * @param  string $searchTerm
     * @return mixed
     */
    public function search($tableName,$searchTerm)
    {
        return Search::searchByTerm($tableName, $searchTerm);
    }

}
