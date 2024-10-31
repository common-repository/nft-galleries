<?php

namespace RebelCode\Spotlight\Nft\Database;

use LogicException;
use RebelCode\Spotlight\Nft\Utils\Formatting;
use RuntimeException;

class Table
{
    /* @var string */
    protected $name;

    /* @var Column[] */
    protected $columns;

    /* @var string */
    protected $pk;

    /** Constructor */
    public function __construct(string $name, array $columns, string $pk)
    {
        global $wpdb;

        $this->name = $wpdb->prefix . $name;
        $this->columns = $columns;
        $this->pk = $pk;
    }

    public function create()
    {
        global $wpdb;

        $schema = ["PRIMARY KEY (`$this->pk`)"];
        foreach ($this->columns as $name => $column) {
            $schema[] = "`{$name}` {$column->toString()}";
        }

        $schemaStr = implode(', ', $schema);
        $collate = $wpdb->get_charset_collate();

        $query = "CREATE TABLE IF NOT EXISTS `$this->name` ($schemaStr) $collate";

        $success = $wpdb->query($query);

        if (!$success) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to create the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }
    }

    public function drop()
    {
        global $wpdb;
        $success = $wpdb->query("DROP TABLE IF EXISTS `{$this->name}`");

        if (!$success) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to drop the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }
    }

    public function get($id): ?array
    {
        $results = $this->query(Where::col($this->pk)->isEqualTo($id), 1);

        return count($results) > 0
            ? $results[0]
            : null;
    }

    public function query(?string $where = null, ?int $limit = null, int $offset = 0): array
    {
        $query = "SELECT * FROM {$this->name}";
        $query .= $this->buildWhereAndLimit($where, $limit, $offset);

        global $wpdb;
        $results = $wpdb->get_results($query, ARRAY_A);

        if ($results === null) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to query the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return $results;
    }

    public function count(?string $where = null): int
    {
        $query = "SELECT COUNT(DISTINCT {$this->pk}) as c FROM {$this->name}";
        $query .= $this->buildWhereAndLimit($where);

        global $wpdb;
        $results = $wpdb->get_results($query, ARRAY_A);

        if ($results === null) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to query the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return intval($results[0]['c']);
    }

    public function insert(array $record): int
    {
        $query = "INSERT INTO {$this->name} ";
        $query .= $this->buildInsertSet([$record]);

        global $wpdb;
        $result = $wpdb->query($query);

        if ($result === false) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to insert record into the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return $wpdb->insert_id;
    }

    public function insertMany(array $records): int
    {
        $query = "INSERT INTO {$this->name} ";
        $query .= $this->buildInsertSet($records);

        global $wpdb;
        $result = $wpdb->query($query);

        if ($result === false) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to insert records into the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return $wpdb->rows_affected;
    }

    public function update(?string $where, array $changes, ?int $limit = null, int $offset = 0): int
    {
        $query = "UPDATE {$this->name} SET ";
        $query .= $this->buildUpdateSet($changes);
        $query .= $this->buildWhereAndLimit($where, $limit, $offset);

        global $wpdb;
        $results = $wpdb->query($query);

        if ($results === false) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to update records in the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return $results;
    }

    public function delete(?string $where, ?int $limit = null, int $offset = 0): int
    {
        $query = "DELETE FROM {$this->name}";
        $query .= $this->buildWhereAndLimit($where, $limit, $offset);

        global $wpdb;
        $results = $wpdb->query($query);

        if ($results === false) {
            throw new RuntimeException(
                sprintf(
                    __('Failed to delete records from the "%s" table. Reason: %s', 'snft'),
                    $this->name,
                    $wpdb->last_error
                )
            );
        }

        return $results;
    }

    protected function buildWhereAndLimit(?string $where, ?int $limit = null, int $offset = 0): string
    {
        $query = '';

        $where = $where ? trim($where) : "";
        if (!empty($where)) {
            $query .= " WHERE $where";
        }

        if ($limit !== null) {
            $query .= " LIMIT $limit";

            if ($offset > 0) {
                $query .= "OFFSET $offset";
            }
        }

        return $query;
    }

    protected function buildInsertSet(array $records): string
    {
        $cols = [];
        $values = [];
        $buildCols = true;

        foreach ($records as $record) {
            foreach ($record as $col => $val) {
                if ($buildCols) {
                    if (!array_key_exists($col, $this->columns)) {
                        throw new LogicException("Column `{$col}` does not exist for table `{$this->name}`");
                    }
                    $cols[] = "`$col`";
                }

                $values[] = Formatting::sqlPrepareScalar($val);
            }
            $buildCols = false;
        }

        $colsStr = implode(', ', $cols);
        $valuesStr = implode(', ', $values);

        return "($colsStr) VALUES ($valuesStr)";
    }

    protected function buildUpdateSet(array $changes): string
    {
        $result = [];
        foreach ($changes as $col => $val) {
            $sVal = Formatting::sqlPrepareScalar($val);
            $result[] = "`$col` = $sVal";
        }

        return implode(', ', $result);
    }
}
