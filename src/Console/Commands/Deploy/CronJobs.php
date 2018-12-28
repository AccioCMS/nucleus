<?php

namespace Accio\Console\Commands\Deploy;

use Accio\Support\Script;
use Illuminate\Console\Command;

class Cronjobs extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deploy:cron --env=production';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean caches on deploy';

    /**
     * @var ScriptParser
     */
    protected $scriptParser;

    /**
     * Create a new command instance.
     * Cronjobs constructor.
     *
     * @param Script $scriptParser
     */
    public function __construct(Script $scriptParser)
    {
        parent::__construct();
        $this->scriptParser = $scriptParser;
    }

    /**
     * Execute the console command.
     *
     * @throws \Exception
     */
    public function handle()
    {
        if(config('deploy.cron')) {
            $this->comment("\nCreating cron jobs");
            foreach(config('deploy.cron') as $cronCommand){
                $output = $this->scriptParser->parseFile(
                    'createCronJobs', [
                    'command' => $cronCommand,
                    'base_path' => base_path(),
                    'env' => $this->option('env')
                    ]
                )->run($this);

                if(!$output) {
                    return false;
                }
            }
        }
    }

}
