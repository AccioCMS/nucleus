<?php
namespace Accio\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Process\Process;

/**
 * Class which checks the installation requirements.
 */
class SystemRequirements
{
    /**
     * @var bool
     */
    private $errors = false;
    /**
     * @var Command
     */
    private $console;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var Process
     */
    private $process;

    /**
     * List of writable directories
     *
     * @var array
     */
    private $writableDirectories = [
        'storage/tmp',
        'storage/logs',
        'storage/framework',
        'storage/framework/cache',
        'storage/framework/sessions',
        'storage/framework/views',
        'bootstrap/cache',
        'public/uploads',
    ];

    /**
     * Requirements constructor.
     *
     * @param Filesystem $filesystem
     */
    public function __construct(
        Filesystem $filesystem
    ) {
        $this->filesystem = $filesystem;
    }
    /**
     * Checks the system meets all the requirements needed to run Deployer.
     *
     * @param  Command $console
     * @return bool
     */
    public function check(Command $console)
    {
        $this->console = $console;

        $this->console->comment("\nChecking system requirements");

        $this->process = new Process($this->console);
        $this->versionCheck();
        $this->extensionCheck();
        $this->hasDatabaseDriver();
        $this->disabledFunctionCheck();
        $this->requiredSystemCommands();
        $this->nodeJsCommand();
        $this->checkPermissions();
        if ($this->errors) {
            $this->console->line('');
            $this->console->block('Accio cannot be installed because your system doesn\'t meet minimal requirements. Please fix the errors above before retrying to install.');
            $this->console->line('');
        }
        return !$this->errors;
    }
    /**
     * Checks the PHP version.
     */
    private function versionCheck()
    {
        // Check PHP version:
        if (!version_compare(PHP_VERSION, '7.1.1', '>=')) {
            $this->console->error('PHP 7.1.1 or higher is required');
            $this->errors = true;
        }
    }
    /**
     * Check for required extensions.
     */
    private function extensionCheck()
    {
        // Check for required PHP extensions
        $required_extensions = ['PDO', 'curl', 'gd', 'json', 'openssl', 'mbstring'];
        $missing = [];
        foreach ($required_extensions as $extension) {
            if (!extension_loaded($extension)) {
                $missing[] = $extension;
            }
        }
        if (count($missing)) {
            asort($missing);
            $this->console->error('Extension required: ' . implode(', ', $missing));
            $this->errors =  true;
        }
    }
    /**
     * Checks if a DB driver is installed.
     */
    private function hasDatabaseDriver()
    {
        if (! count(AccioInstallOptions::getDatabaseDrivers())) {
            $this->console->error(
                'At least 1 PDO driver is required. Either sqlite, mysql or pgsql, check your php.ini file'
            );
            $this->errors = true;
        }
        return false;
    }
    /**
     * Checks that required PHP functions are not disabled.
     */
    private function disabledFunctionCheck()
    {
        $functions = [
            'exec'
        ];
        // Functions needed by symfony process
        foreach($functions as $function){
            if (!function_exists($function)) {
                $this->console->error('Function  "'.$function.'" is required. Is it disabled in php.ini?');
                $this->errors = true;
            }
        }
    }
    /**
     * Checks that all the required system commands are available.
     */
    private function requiredSystemCommands()
    {

        // todo fix command existence in windows os
        return true;


        // Programs needed in $PATH
        $required_commands = ['git', 'rsync','php', 'composer'];

        $missing = [];
        foreach ($required_commands as $command) {
            $this->process->setCommandLine('which ' . $command);
            $this->process->setTimeout(null);
            $this->process->run();

            if (!$this->process->isSuccessful()) {
                $missing[] = $command;
            }
        }

        if (count($missing)) {
            asort($missing);

            $this->console->error('Commands not found: ' . implode(', ', $missing));
            $this->errors = true;
        }
    }
    /**
     * Tests that nodejs exists in one of the two possible names.
     */
    private function nodeJsCommand()
    {

        // todo check nodejs exists in windows os
        return true;
        $found = false;
        foreach (['node', 'nodejs'] as $command) {
            $this->process->setCommandLine('which ' . $command);
            $this->process->setTimeout(null);
            $this->process->run();

            if ($this->process->isSuccessful()) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            $this->console->error('node.js was not found');
            $this->errors =  true;
        }
    }

    /**
     * Checks the expected paths are writable.
     */
    private function checkPermissions()
    {
        foreach ($this->writableDirectories as $path) {
            if (!$this->filesystem->isWritable(base_path($path))) {
                $this->console->error($path . ' is not writable');
                $this->errors = true;
            }
        }
    }
}
