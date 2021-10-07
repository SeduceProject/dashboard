#!/bin/bash
DB_NAME="mondb"

influx -database $DB_NAME -execute "CREATE CONTINUOUS QUERY power_mean_5m_cq ON $DB_NAME BEGIN \
  SELECT MEAN(value) INTO power_mean_5m FROM sensors \
  WHERE unit = 'W' \
  GROUP BY sensor, time(5m) \
END"
