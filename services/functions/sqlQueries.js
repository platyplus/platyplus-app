exports.SQL_AGGREGATE_ENTITY_DATA = (id, rules) =>
  `select jsonb_build_object( ${rules.join(', ')} ) as data
from encounter
where entity_id = '${id}'
group by entity_id, created_at
order by created_at asc`
