CREATE DOMAIN public.email AS text
	CONSTRAINT email_check CHECK ((VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$'::text));
CREATE FUNCTION public.first_agg(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
        SELECT $1;
$_$;
CREATE FUNCTION public.last_agg(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
        SELECT $2;
$_$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE FUNCTION public.set_default_path() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	new_destination text := '';
BEGIN
  	IF (TG_OP = 'INSERT') THEN
  		NEW.id := gen_random_uuid();
  	END IF;
	IF NEW.parent_id IS NOT NULL THEN
		SELECT org_unit.path INTO new_destination FROM org_unit WHERE id = NEW.parent_id;
		NEW.path := new_destination || '.' || trim_uuid(NEW.id);
	ELSE
		NEW.path := trim_uuid(NEW.id);
	END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.set_org_unit_descendants() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	new_destination text := '';
BEGIN
	IF NEW.parent_id IS NOT NULL THEN
		SELECT org_unit.path INTO new_destination FROM org_unit WHERE id = NEW.parent_id;
	END IF;
	IF (TG_OP = 'UPDATE' AND NEW.parent_id IS DISTINCT FROM OLD.parent_id) THEN
		update org_unit set path = new_destination || subpath(path, nlevel(OLD.path)-1) where path <@ OLD.path;
	END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.trigger_after_set_state_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- updates the end date of the previous state, if any
  update state
    set date_end = new.date_start
    from (select id
      from state
      where entity_id = new.entity_id
      and date_start < new.date_start
      order by date_start desc
      limit 1) as last_state
    where state.id = last_state.id;
  RETURN null;
END;
$$;
CREATE FUNCTION public.trigger_set_entity_data() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  entity_type_id uuid;
  entity_type_schema jsonb;
  curs text;
  entity_data jsonb='{}';
begin
  if new.entity_id is not null then -- Gets the schema of the entity type
    select "schema" into entity_type_schema
      from "entity_type", "entity"
      where entity_type.id = entity.type_id and entity.id = new.entity_id;
  else -- Creates the entity and gets its entity type schema
    select entity_type.id, entity_type."schema"
      into entity_type_id, entity_type_schema
      from encounter_type, entity_type where encounter_type.id = new.type.id and encounter_type.entity_type_id = entity_type.id;
    if entity_type_id is not null then
      insert into entity (type_id) values (entity_type_id) returning id into new.entity_id;
    end if;
  end if;
  if entity_type_schema is not null then
    for curs in select * from jsonb_object_keys(entity_type_schema)
    loop
      entity_data = entity_data || jsonb_build_object(curs, new.data->curs);
        new.data = new.data - curs;
    end loop;
    update entity set attributes = attributes || entity_data WHERE id = new.entity_id;
  end if;
  RETURN NEW;
END;
$$;
CREATE FUNCTION public.trigger_set_state_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- TODO: same workflow
  if (tg_op = 'DELETE') then
    update state
      set date_end = old.date_end
      from (select id
        from state
        where entity_id = old.entity_id
        and date_start < old.date_start
        order by date_start desc
        limit 1) as last_state
      where state.id = last_state.id;
    RETURN OLD;
  else
    SELECT date_start into new.date_end
        FROM state
        WHERE entity_id = new.entity_id
        and date_start > new.date_start
        order by date_start asc
        limit 1;
      new.date_end = coalesce(new.date_end, 'infinity'::timestamptz);
    RETURN NEW;
  end if;
END;
$$;
CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
CREATE FUNCTION public.trim_uuid(uuid_value uuid) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN REGEXP_REPLACE(uuid_value::text,'[^\w]+','','g');
END;
$$;
CREATE AGGREGATE public.first(anyelement) (
    SFUNC = public.first_agg,
    STYPE = anyelement
);
CREATE AGGREGATE public.last(anyelement) (
    SFUNC = public.last_agg,
    STYPE = anyelement
);
CREATE TABLE public.encounter_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    entity_type_id uuid,
    title_create text,
    encounter_schema jsonb DEFAULT '{}'::jsonb NOT NULL,
    encounter_title text
);
CREATE TABLE public.encounter_type_action (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    stage_transition_id uuid NOT NULL
);
CREATE TABLE public.entity_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    schema jsonb DEFAULT '{}'::jsonb NOT NULL
);
CREATE TABLE public.org_unit (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type_id uuid,
    name text NOT NULL,
    path public.ltree,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.org_unit_isolated_encounter_type (
    org_unit_id uuid NOT NULL,
    encounter_type_id uuid NOT NULL
);
CREATE TABLE public.org_unit_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.org_unit_type_mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    from_id uuid NOT NULL,
    to_id uuid NOT NULL
);
CREATE TABLE public.org_unit_workflow (
    org_unit_id uuid NOT NULL,
    workflow_id uuid NOT NULL
);
CREATE TABLE public.role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    global boolean DEFAULT false
);
CREATE TABLE public.role_attribution (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    org_unit_id uuid NOT NULL
);
CREATE TABLE public.stage (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    workflow_id uuid,
    name text,
    schema jsonb DEFAULT '{}'::jsonb NOT NULL
);
CREATE TABLE public.stage_transition (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    previous_id uuid,
    next_id uuid
);
CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    token character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb,
    active boolean DEFAULT true NOT NULL,
    preferred_org_unit_id uuid,
    locale text DEFAULT 'en-uk'::text,
    CONSTRAINT check_min_length CHECK ((length((username)::text) >= 2))
);
CREATE TABLE public.user_org_unit (
    user_id uuid NOT NULL,
    org_unit_id uuid NOT NULL
);
CREATE TABLE public.user_role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);
COMMENT ON TABLE public.user_role IS 'Global user roles for the entire application';
CREATE TABLE public.workflow (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    entity_type_id uuid,
    parent_id uuid
);
CREATE VIEW public.check_constraint AS
 SELECT cons.table_schema,
    cons.table_name,
    cons.constraint_name,
    cons."check"
   FROM (hdb_catalog.hdb_check_constraint cons
     JOIN hdb_catalog.hdb_table tab ON (((cons.table_name = tab.table_name) AND (cons.table_schema = tab.table_schema))));
CREATE TABLE public.concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    class_id uuid,
    data_type_id uuid,
    source_id uuid
);
CREATE TABLE public.concept_aggregation (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    stage_id uuid NOT NULL,
    concept_id uuid NOT NULL
);
CREATE TABLE public.concept_class (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE TABLE public.data_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE TABLE public.encounter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    provider_id uuid,
    type_id uuid,
    org_unit_id uuid,
    data jsonb DEFAULT '{}'::jsonb,
    entity_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.encounter_type_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    concept_id uuid NOT NULL
);
CREATE TABLE public.encounter_type_permission (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    role_id uuid NOT NULL
);
CREATE TABLE public.entity (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type_id uuid,
    attributes jsonb DEFAULT '{}'::jsonb
);
CREATE TABLE public.entity_type_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    entity_type_id uuid NOT NULL,
    concept_id uuid NOT NULL
);
CREATE VIEW public.foreign_key_constraint AS
 SELECT cons.table_schema,
    cons.table_name,
    cons.constraint_name,
    cons.ref_table AS ref_table_name,
    cons.ref_table_table_schema AS ref_table_schema,
    cons.column_mapping,
    cons.on_update,
    cons.on_delete
   FROM (hdb_catalog.hdb_foreign_key_constraint cons
     JOIN hdb_catalog.hdb_table tab ON (((cons.table_name = tab.table_name) AND (cons.table_schema = tab.table_schema))));
CREATE TABLE public.mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    from_id uuid NOT NULL,
    to_id uuid NOT NULL,
    source_id uuid,
    type_id uuid
);
CREATE TABLE public.mapping_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE VIEW public.org_unit_tree WITH (security_barrier='false') AS
 SELECT n1.id AS descendant_id,
    n2.id,
    n2.type_id,
    n2.name,
    n2.path,
    n2.parent_id
   FROM (public.org_unit n1
     LEFT JOIN public.org_unit n2 ON (((n1.path OPERATOR(public.<@) n2.path) AND (n1.id <> n2.id))));
CREATE VIEW public.permission AS
 SELECT hdb_permission_agg.table_schema,
    hdb_permission_agg.table_name,
    hdb_permission_agg.role_name,
    (hdb_permission_agg.permissions -> 'select'::text) AS "select",
    (hdb_permission_agg.permissions -> 'insert'::text) AS insert,
    (hdb_permission_agg.permissions -> 'update'::text) AS update,
    (hdb_permission_agg.permissions -> 'delete'::text) AS delete
   FROM hdb_catalog.hdb_permission_agg;
CREATE VIEW public.primary_key AS
 SELECT pk.table_schema,
    pk.table_name,
    pk.constraint_name,
    pk.columns
   FROM hdb_catalog.hdb_primary_key pk;
CREATE VIEW public.relationship AS
 SELECT hdb_relationship.table_schema,
    hdb_relationship.table_name,
    hdb_relationship.rel_name AS name,
    hdb_relationship.rel_type AS type,
    hdb_relationship.rel_def AS definition,
    hdb_relationship.comment
   FROM hdb_catalog.hdb_relationship
  WHERE (hdb_relationship.is_system_defined IS FALSE);
CREATE TABLE public.state (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    entity_id uuid,
    org_unit_id uuid,
    stage_id uuid,
    data jsonb DEFAULT '{}'::jsonb,
    date_start timestamp with time zone DEFAULT now() NOT NULL,
    date_end timestamp with time zone
);
CREATE VIEW public."table" AS
 SELECT tables.table_name,
    tables.table_schema,
    COALESCE(columns.columns, '[]'::json) AS columns,
    COALESCE(pk.columns, '[]'::json) AS primary_key_columns,
    COALESCE(constraints.constraints, '[]'::json) AS constraints,
    COALESCE(views.view_info, 'null'::json) AS view_info
   FROM (((((information_schema.tables tables
     LEFT JOIN ( SELECT c.table_name,
            c.table_schema,
            json_agg(json_build_object('name', c.column_name, 'type', c.udt_name, 'domain', c.domain_name, 'default', c.column_default, 'is_nullable', (c.is_nullable)::boolean)) AS columns
           FROM information_schema.columns c
          GROUP BY c.table_schema, c.table_name) columns ON ((((tables.table_schema)::text = (columns.table_schema)::text) AND ((tables.table_name)::text = (columns.table_name)::text))))
     LEFT JOIN ( SELECT hdb_primary_key.table_schema,
            hdb_primary_key.table_name,
            hdb_primary_key.constraint_name,
            hdb_primary_key.columns
           FROM hdb_catalog.hdb_primary_key) pk ON ((((tables.table_schema)::text = (pk.table_schema)::text) AND ((tables.table_name)::text = (pk.table_name)::text))))
     LEFT JOIN ( SELECT c.table_schema,
            c.table_name,
            json_agg(c.constraint_name) AS constraints
           FROM information_schema.table_constraints c
          WHERE (((c.constraint_type)::text = 'UNIQUE'::text) OR ((c.constraint_type)::text = 'PRIMARY KEY'::text))
          GROUP BY c.table_schema, c.table_name) constraints ON ((((tables.table_schema)::text = (constraints.table_schema)::text) AND ((tables.table_name)::text = (constraints.table_name)::text))))
     LEFT JOIN ( SELECT v.table_schema,
            v.table_name,
            json_build_object('is_updatable', ((v.is_updatable)::boolean OR (v.is_trigger_updatable)::boolean), 'is_deletable', ((v.is_updatable)::boolean OR (v.is_trigger_deletable)::boolean), 'is_insertable', ((v.is_insertable_into)::boolean OR (v.is_trigger_insertable_into)::boolean)) AS view_info
           FROM information_schema.views v) views ON ((((tables.table_schema)::text = (views.table_schema)::text) AND ((tables.table_name)::text = (views.table_name)::text))))
     JOIN hdb_catalog.hdb_table ON ((((tables.table_schema)::text = hdb_table.table_schema) AND ((tables.table_name)::text = hdb_table.table_name) AND (hdb_table.is_system_defined IS FALSE))));
CREATE TABLE public.terminology_collection (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    org_unit_id uuid
);
CREATE TABLE public.terminology_collection_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    collection_id uuid,
    concept_id uuid
);
CREATE TABLE public.terminology_collection_mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    collection_id uuid,
    mapping_id uuid
);
CREATE TABLE public.terminology_source (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    org_unit_id uuid
);
CREATE TABLE public.test (
    id integer NOT NULL
);
CREATE SEQUENCE public.test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.test_id_seq OWNED BY public.test.id;
ALTER TABLE ONLY public.test ALTER COLUMN id SET DEFAULT nextval('public.test_id_seq'::regclass);
ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.concept_class
    ADD CONSTRAINT concept_class_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.data_type
    ADD CONSTRAINT data_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.encounter_type
    ADD CONSTRAINT encounter_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.encounter_type_action
    ADD CONSTRAINT encounter_type_state_type_step_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.entity_type
    ADD CONSTRAINT entity_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mapping_type
    ADD CONSTRAINT mapping_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.org_unit_isolated_encounter_type
    ADD CONSTRAINT org_unit_isolated_encounter_type_pkey PRIMARY KEY (org_unit_id, encounter_type_id);
ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.org_unit_type
    ADD CONSTRAINT org_unit_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.org_unit_workflow
    ADD CONSTRAINT org_unit_workflow_pkey PRIMARY KEY (org_unit_id, workflow_id);
ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_key UNIQUE (name);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stage
    ADD CONSTRAINT state_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terminology_collection
    ADD CONSTRAINT terminology_collection_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terminology_source
    ADD CONSTRAINT terminology_source_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_org_unit_pkey PRIMARY KEY (user_id, org_unit_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);
ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_pkey PRIMARY KEY (id);
CREATE INDEX concept_aggregation_concept_id_idx ON public.concept_aggregation USING btree (concept_id);
CREATE INDEX concept_aggregation_state_type_id_idx ON public.concept_aggregation USING btree (stage_id);
CREATE INDEX concept_class_id_idx ON public.concept USING btree (class_id);
CREATE INDEX concept_data_type_id_idx ON public.concept USING btree (data_type_id);
CREATE INDEX concept_source_id_idx ON public.concept USING btree (source_id);
CREATE INDEX encounter_org_unit_id_idx ON public.encounter USING btree (org_unit_id);
CREATE INDEX encounter_type_concept_concept_id_idx ON public.encounter_type_concept USING btree (concept_id);
CREATE INDEX encounter_type_concept_encounter_type_id_idx ON public.encounter_type_concept USING btree (encounter_type_id);
CREATE INDEX encounter_type_id_idx ON public.encounter USING btree (type_id);
CREATE INDEX encounter_type_state_type_step_encounter_type_id_idx ON public.encounter_type_action USING btree (encounter_type_id);
CREATE INDEX encounter_type_state_type_step_state_type_step_id_idx ON public.encounter_type_action USING btree (stage_transition_id);
CREATE INDEX entity_type_concept_concept_id_idx ON public.entity_type_concept USING btree (concept_id);
CREATE INDEX entity_type_concept_entity_type_id_idx ON public.entity_type_concept USING btree (entity_type_id);
CREATE INDEX entity_type_id_idx ON public.entity USING btree (type_id);
CREATE INDEX mapping_from_id_idx ON public.mapping USING btree (from_id);
CREATE INDEX mapping_source_id_idx ON public.mapping USING btree (source_id);
CREATE INDEX mapping_to_id_idx ON public.mapping USING btree (to_id);
CREATE INDEX mapping_type_id_idx ON public.mapping USING btree (type_id);
CREATE INDEX org_unit_path_idx ON public.org_unit USING btree (path);
CREATE INDEX org_unit_type_id_idx ON public.org_unit USING btree (type_id);
CREATE INDEX state_entity_id_idx ON public.state USING btree (entity_id);
CREATE INDEX state_org_unit_id_idx ON public.state USING btree (org_unit_id);
CREATE INDEX state_type_id_idx ON public.state USING btree (stage_id);
CREATE INDEX state_type_step_next_step_id_idx ON public.stage_transition USING btree (next_id);
CREATE INDEX state_type_step_previous_step_id_idx ON public.stage_transition USING btree (previous_id);
CREATE INDEX state_type_workflow_id_idx ON public.stage USING btree (workflow_id);
CREATE INDEX terminology_collection_concept_collection_id_idx ON public.terminology_collection_concept USING btree (collection_id);
CREATE INDEX terminology_collection_concept_concept_id_idx ON public.terminology_collection_concept USING btree (concept_id);
CREATE INDEX terminology_collection_mapping_collection_id_idx ON public.terminology_collection_mapping USING btree (collection_id);
CREATE INDEX terminology_collection_mapping_mapping_id_idx ON public.terminology_collection_mapping USING btree (mapping_id);
CREATE INDEX terminology_collection_org_unit_id_idx ON public.terminology_collection USING btree (org_unit_id);
CREATE INDEX terminology_source_org_unit_id_idx ON public.terminology_source USING btree (org_unit_id);
CREATE INDEX user_active_idx ON public."user" USING btree (active);
CREATE INDEX user_token_idx ON public."user" USING btree (token);
CREATE TRIGGER after_set_state_dates AFTER INSERT OR UPDATE OF date_start ON public.state FOR EACH ROW EXECUTE PROCEDURE public.trigger_after_set_state_dates();
CREATE TRIGGER set_public_org_unit_updated_at BEFORE UPDATE ON public.org_unit FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_org_unit_updated_at ON public.org_unit IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_state_dates BEFORE INSERT OR DELETE OR UPDATE OF date_start ON public.state FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_state_dates();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.encounter FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_state_type_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(id);
ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.concept_class(id);
ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_data_type_id_fkey FOREIGN KEY (data_type_id) REFERENCES public.data_type(id);
ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.terminology_source(id);
ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entity(id);
ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);
ALTER TABLE ONLY public.encounter_type
    ADD CONSTRAINT encounter_type_entity_type_id_fkey FOREIGN KEY (entity_type_id) REFERENCES public.entity_type(id);
ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.encounter_type(id);
ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);
ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);
ALTER TABLE ONLY public.encounter_type_action
    ADD CONSTRAINT encounter_type_state_type_step_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);
ALTER TABLE ONLY public.encounter_type_action
    ADD CONSTRAINT encounter_type_state_type_step_state_type_step_id_fkey FOREIGN KEY (stage_transition_id) REFERENCES public.stage_transition(id);
ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_entity_type_id_fkey FOREIGN KEY (entity_type_id) REFERENCES public.entity_type(id);
ALTER TABLE ONLY public.entity
    ADD CONSTRAINT entity_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.entity_type(id);
ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_from_id_fkey FOREIGN KEY (from_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.terminology_source(id);
ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_to_id_fkey FOREIGN KEY (to_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.mapping_type(id);
ALTER TABLE ONLY public.org_unit_isolated_encounter_type
    ADD CONSTRAINT org_unit_isolated_encounter_type_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);
ALTER TABLE ONLY public.org_unit_isolated_encounter_type
    ADD CONSTRAINT org_unit_isolated_encounter_type_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.org_unit(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.org_unit_type(id);
ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_from_id_fkey FOREIGN KEY (from_id) REFERENCES public.org_unit_type(id);
ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_to_id_fkey FOREIGN KEY (to_id) REFERENCES public.org_unit_type(id);
ALTER TABLE ONLY public.org_unit_workflow
    ADD CONSTRAINT org_unit_workflow_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.org_unit_workflow
    ADD CONSTRAINT org_unit_workflow_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.workflow(id);
ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);
ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entity(id);
ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_type_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(id);
ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_next_step_id_fkey FOREIGN KEY (next_id) REFERENCES public.stage(id);
ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_previous_step_id_fkey FOREIGN KEY (previous_id) REFERENCES public.stage(id);
ALTER TABLE ONLY public.stage
    ADD CONSTRAINT state_type_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.workflow(id);
ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.terminology_collection(id);
ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);
ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.terminology_collection(id);
ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES public.mapping(id);
ALTER TABLE ONLY public.terminology_collection
    ADD CONSTRAINT terminology_collection_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.terminology_source
    ADD CONSTRAINT terminology_source_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_orgunit_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_orgunit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_preferred_org_unit_id_fkey FOREIGN KEY (preferred_org_unit_id) REFERENCES public.org_unit(id);
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_entity_type_id_fkey FOREIGN KEY (entity_type_id) REFERENCES public.entity_type(id);
ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.workflow(id);
