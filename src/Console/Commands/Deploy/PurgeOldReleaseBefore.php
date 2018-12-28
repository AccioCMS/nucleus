<?php

namespace Accio\Console\Commands\Deploy;

use Accio\Support\Script;
use Illuminate\Console\Command;

class PurgeOldReleaseBefore extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deploy:purge_old_release.before';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Purge Old Release - Before commands';

    /**
     * @var Script
     */
    protected $scriptParser;

    /**
     * PurgeOldReleaseBefore constructor.
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
     * @return mixed
     */
    public function handle()
    {
        $commands = config('deploy.commands.purge_old_releases.before');
        foreach($commands as $command){
            $output = $this->scriptParser->parseString(
                $command, [
                'base_path' => base_path(),
                'env' => $this->option('env')
                ]
            )->run($this);

            if(!$output) {
                return false;
            }
        }

        return true;
    }
}
