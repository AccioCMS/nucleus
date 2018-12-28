<?php

namespace Accio\Console;

use DateTimeZone;
use Illuminate\Support\Collection;

class AccioInstallOptions
{
    /**
     * Available timezones
     *
     * @var array
     */
    private static $timezones = [
        'UTC'        => DateTimeZone::UTC,
        'Africa'     => DateTimeZone::AFRICA,
        'America'    => DateTimeZone::AMERICA,
        'Antarctica' => DateTimeZone::ANTARCTICA,
        'Asia'       => DateTimeZone::ASIA,
        'Atlantic'   => DateTimeZone::ATLANTIC,
        'Australia'  => DateTimeZone::AUSTRALIA,
        'Europe'     => DateTimeZone::EUROPE,
        'Indian'     => DateTimeZone::INDIAN,
        'Pacific'    => DateTimeZone::PACIFIC,
    ];

    /**
     * Gets an array of available PDO drivers which are supported by Laravel.
     *
     * @return array
     */
    public static function getDatabaseDrivers()
    {
        // Use the function instead of PDO::getAvailableDrivers so it can be mocked
        $available = new Collection(pdo_drivers());
        return array_values($available->intersect(['mysql', 'pgsql', 'sqlite'])->all());
    }
    /**
     * Gets a list of timezone regions.
     *
     * @return array
     */
    public static function getTimezoneRegions()
    {
        return self::$timezones;
    }
    /**
     * Gets a list of available locations in the supplied region.
     *
     * @param int $region The region constant
     *
     * @return array
     *
     * @see DateTimeZone
     */
    public static function getTimezoneLocations($region)
    {
        $locations = [];
        foreach (DateTimeZone::listIdentifiers($region) as $timezone) {
            $locations[] = substr($timezone, strpos($timezone, '/') + 1);
        }
        return $locations;
    }
}
