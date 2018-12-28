<?php

namespace Accio\Console\Commands;

use Illuminate\Console\Command;
use Accio\Console\SystemRequirements;
use Accio\Console\CommandLineStyles;

class CheckRequirements extends Command
{
    use CommandLineStyles;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:requirements';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check Server compatibility ';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @param  SystemRequirements $requirements
     * @return mixed
     */
    public function handle(SystemRequirements $requirements)
    {
        if($requirements->check($this)) {
            $this->block(' -- You are all set :) -- ', 'fg=white;bg=green;options=bold');
            $this->line('');
        }
    }

}
