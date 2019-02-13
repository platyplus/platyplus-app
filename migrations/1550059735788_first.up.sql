--
-- DO NOT CREATE THE public SCHEMA! IT IS ALREADY CREATED BY HASURA
-- CREATE THE LTREE EXTENSION!!!
create extension ltree;
-- AND NOW WE CAN START!
--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1
-- Dumped by pg_dump version 11.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: set_default_path(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.set_default_path() OWNER TO postgres;

--
-- Name: set_org_unit_descendants(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.set_org_unit_descendants() OWNER TO postgres;

--
-- Name: trim_uuid(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trim_uuid(uuid_value uuid) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN REGEXP_REPLACE(uuid_value::text,'[^\w]+','','g');
END;
$$;


ALTER FUNCTION public.trim_uuid(uuid_value uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb,
    active boolean DEFAULT true NOT NULL,
    preferred_org_unit_id uuid,
    locale text DEFAULT 'en-uk'::text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: encounter_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    entity_type_id uuid,
    form jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.encounter_type OWNER TO postgres;

--
-- Name: entity_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entity_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text
);


ALTER TABLE public.entity_type OWNER TO postgres;

--
-- Name: org_unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_unit (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type_id uuid,
    name text,
    path public.ltree,
    parent_id uuid
);


ALTER TABLE public.org_unit OWNER TO postgres;

--
-- Name: org_unit_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_unit_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.org_unit_type OWNER TO postgres;

--
-- Name: org_unit_type_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_unit_type_mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    from_id uuid NOT NULL,
    to_id uuid NOT NULL
);


ALTER TABLE public.org_unit_type_mapping OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    global boolean DEFAULT false
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_attribution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_attribution (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    org_unit_id uuid NOT NULL
);


ALTER TABLE public.role_attribution OWNER TO postgres;

--
-- Name: stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stage (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    workflow_id uuid,
    name text
);


ALTER TABLE public.stage OWNER TO postgres;

--
-- Name: stage_transition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stage_transition (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    previous_id uuid,
    next_id uuid
);


ALTER TABLE public.stage_transition OWNER TO postgres;

--
-- Name: user_org_unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_org_unit (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    org_unit_id uuid NOT NULL
);


ALTER TABLE public.user_org_unit OWNER TO postgres;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_role OWNER TO postgres;

--
-- Name: TABLE user_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_role IS 'Global user roles for the entire application';


--
-- Name: workflow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.workflow OWNER TO postgres;

--
-- Name: concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    class_id uuid,
    data_type_id uuid,
    source_id uuid
);


ALTER TABLE public.concept OWNER TO postgres;

--
-- Name: concept_aggregation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concept_aggregation (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    stage_id uuid NOT NULL,
    concept_id uuid NOT NULL
);


ALTER TABLE public.concept_aggregation OWNER TO postgres;

--
-- Name: concept_class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concept_class (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);


ALTER TABLE public.concept_class OWNER TO postgres;

--
-- Name: data_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);


ALTER TABLE public.data_type OWNER TO postgres;

--
-- Name: encounter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    entity_id uuid,
    provider_id uuid,
    type_id uuid,
    org_unit_id uuid,
    state_id uuid
);


ALTER TABLE public.encounter OWNER TO postgres;

--
-- Name: encounter_type_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter_type_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    concept_id uuid NOT NULL
);


ALTER TABLE public.encounter_type_concept OWNER TO postgres;

--
-- Name: encounter_type_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter_type_permission (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.encounter_type_permission OWNER TO postgres;

--
-- Name: encounter_type_stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter_type_stage (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    stage_id uuid NOT NULL
);


ALTER TABLE public.encounter_type_stage OWNER TO postgres;

--
-- Name: encounter_type_stage_transition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounter_type_stage_transition (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    encounter_type_id uuid NOT NULL,
    stage_transition_id uuid NOT NULL
);


ALTER TABLE public.encounter_type_stage_transition OWNER TO postgres;

--
-- Name: entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entity (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type_id uuid,
    attributes jsonb
);


ALTER TABLE public.entity OWNER TO postgres;

--
-- Name: entity_type_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entity_type_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    entity_type_id uuid NOT NULL,
    concept_id uuid NOT NULL
);


ALTER TABLE public.entity_type_concept OWNER TO postgres;

--
-- Name: mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    from_id uuid NOT NULL,
    to_id uuid NOT NULL,
    source_id uuid,
    type_id uuid
);


ALTER TABLE public.mapping OWNER TO postgres;

--
-- Name: mapping_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mapping_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);


ALTER TABLE public.mapping_type OWNER TO postgres;

--
-- Name: org_unit_tree; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.org_unit_tree WITH (security_barrier='false') AS
 SELECT n1.id AS descendant_id,
    n2.id,
    n2.type_id,
    n2.name,
    n2.path,
    n2.parent_id
   FROM (public.org_unit n1
     LEFT JOIN public.org_unit n2 ON (((n1.path OPERATOR(public.<@) n2.path) AND (n1.id <> n2.id))));


ALTER TABLE public.org_unit_tree OWNER TO postgres;

--
-- Name: state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.state (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    entity_id uuid,
    org_unit_id uuid,
    stage_id uuid
);


ALTER TABLE public.state OWNER TO postgres;

--
-- Name: terminology_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terminology_collection (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    org_unit_id uuid
);


ALTER TABLE public.terminology_collection OWNER TO postgres;

--
-- Name: terminology_collection_concept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terminology_collection_concept (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    collection_id uuid,
    concept_id uuid
);


ALTER TABLE public.terminology_collection_concept OWNER TO postgres;

--
-- Name: terminology_collection_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terminology_collection_mapping (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    collection_id uuid,
    mapping_id uuid
);


ALTER TABLE public.terminology_collection_mapping OWNER TO postgres;

--
-- Name: terminology_source; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terminology_source (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    org_unit_id uuid
);


ALTER TABLE public.terminology_source OWNER TO postgres;

--
-- Name: concept_aggregation concept_aggregation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_pkey PRIMARY KEY (id);


--
-- Name: concept_class concept_class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept_class
    ADD CONSTRAINT concept_class_pkey PRIMARY KEY (id);


--
-- Name: concept concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_pkey PRIMARY KEY (id);


--
-- Name: data_type data_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_type
    ADD CONSTRAINT data_type_pkey PRIMARY KEY (id);


--
-- Name: encounter encounter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_pkey PRIMARY KEY (id);


--
-- Name: encounter_type_concept encounter_type_concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_pkey PRIMARY KEY (id);


--
-- Name: encounter_type_permission encounter_type_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_pkey PRIMARY KEY (id);


--
-- Name: encounter_type encounter_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type
    ADD CONSTRAINT encounter_type_pkey PRIMARY KEY (id);


--
-- Name: encounter_type_stage encounter_type_state_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage
    ADD CONSTRAINT encounter_type_state_type_pkey PRIMARY KEY (id);


--
-- Name: encounter_type_stage_transition encounter_type_state_type_step_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage_transition
    ADD CONSTRAINT encounter_type_state_type_step_pkey PRIMARY KEY (id);


--
-- Name: entity entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (id);


--
-- Name: entity_type_concept entity_type_concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_pkey PRIMARY KEY (id);


--
-- Name: entity_type entity_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_type
    ADD CONSTRAINT entity_type_pkey PRIMARY KEY (id);


--
-- Name: mapping mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_pkey PRIMARY KEY (id);


--
-- Name: mapping_type mapping_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping_type
    ADD CONSTRAINT mapping_type_pkey PRIMARY KEY (id);


--
-- Name: org_unit org_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_pkey PRIMARY KEY (id);


--
-- Name: org_unit_type_mapping org_unit_type_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_pkey PRIMARY KEY (id);


--
-- Name: org_unit_type org_unit_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit_type
    ADD CONSTRAINT org_unit_type_pkey PRIMARY KEY (id);


--
-- Name: role_attribution role_attribution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_pkey PRIMARY KEY (id);


--
-- Name: role role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_key UNIQUE (name);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: state state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: stage state_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT state_type_pkey PRIMARY KEY (id);


--
-- Name: stage_transition state_type_step_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_pkey PRIMARY KEY (id);


--
-- Name: terminology_collection_concept terminology_collection_concept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_pkey PRIMARY KEY (id);


--
-- Name: terminology_collection_mapping terminology_collection_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_pkey PRIMARY KEY (id);


--
-- Name: terminology_collection terminology_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection
    ADD CONSTRAINT terminology_collection_pkey PRIMARY KEY (id);


--
-- Name: terminology_source terminology_source_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_source
    ADD CONSTRAINT terminology_source_pkey PRIMARY KEY (id);


--
-- Name: user_org_unit user_orgunit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_orgunit_pkey PRIMARY KEY (id);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- Name: workflow workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_pkey PRIMARY KEY (id);


--
-- Name: concept_aggregation_concept_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX concept_aggregation_concept_id_idx ON public.concept_aggregation USING btree (concept_id);


--
-- Name: concept_aggregation_state_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX concept_aggregation_state_type_id_idx ON public.concept_aggregation USING btree (stage_id);


--
-- Name: concept_class_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX concept_class_id_idx ON public.concept USING btree (class_id);


--
-- Name: concept_data_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX concept_data_type_id_idx ON public.concept USING btree (data_type_id);


--
-- Name: concept_source_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX concept_source_id_idx ON public.concept USING btree (source_id);


--
-- Name: encounter_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_entity_id_idx ON public.encounter USING btree (entity_id);


--
-- Name: encounter_org_unit_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_org_unit_id_idx ON public.encounter USING btree (org_unit_id);


--
-- Name: encounter_type_concept_concept_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_concept_concept_id_idx ON public.encounter_type_concept USING btree (concept_id);


--
-- Name: encounter_type_concept_encounter_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_concept_encounter_type_id_idx ON public.encounter_type_concept USING btree (encounter_type_id);


--
-- Name: encounter_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_id_idx ON public.encounter USING btree (type_id);


--
-- Name: encounter_type_state_type_encounter_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_state_type_encounter_type_id_idx ON public.encounter_type_stage USING btree (encounter_type_id);


--
-- Name: encounter_type_state_type_state_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_state_type_state_type_id_idx ON public.encounter_type_stage USING btree (stage_id);


--
-- Name: encounter_type_state_type_step_encounter_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_state_type_step_encounter_type_id_idx ON public.encounter_type_stage_transition USING btree (encounter_type_id);


--
-- Name: encounter_type_state_type_step_state_type_step_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX encounter_type_state_type_step_state_type_step_id_idx ON public.encounter_type_stage_transition USING btree (stage_transition_id);


--
-- Name: entity_type_concept_concept_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX entity_type_concept_concept_id_idx ON public.entity_type_concept USING btree (concept_id);


--
-- Name: entity_type_concept_entity_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX entity_type_concept_entity_type_id_idx ON public.entity_type_concept USING btree (entity_type_id);


--
-- Name: entity_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX entity_type_id_idx ON public.entity USING btree (type_id);


--
-- Name: mapping_from_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX mapping_from_id_idx ON public.mapping USING btree (from_id);


--
-- Name: mapping_source_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX mapping_source_id_idx ON public.mapping USING btree (source_id);


--
-- Name: mapping_to_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX mapping_to_id_idx ON public.mapping USING btree (to_id);


--
-- Name: mapping_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX mapping_type_id_idx ON public.mapping USING btree (type_id);


--
-- Name: org_unit_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX org_unit_path_idx ON public.org_unit USING btree (path);


--
-- Name: org_unit_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX org_unit_type_id_idx ON public.org_unit USING btree (type_id);


--
-- Name: state_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_entity_id_idx ON public.state USING btree (entity_id);


--
-- Name: state_org_unit_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_org_unit_id_idx ON public.state USING btree (org_unit_id);


--
-- Name: state_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_type_id_idx ON public.state USING btree (stage_id);


--
-- Name: state_type_step_next_step_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_type_step_next_step_id_idx ON public.stage_transition USING btree (next_id);


--
-- Name: state_type_step_previous_step_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_type_step_previous_step_id_idx ON public.stage_transition USING btree (previous_id);


--
-- Name: state_type_workflow_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX state_type_workflow_id_idx ON public.stage USING btree (workflow_id);


--
-- Name: terminology_collection_concept_collection_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_collection_concept_collection_id_idx ON public.terminology_collection_concept USING btree (collection_id);


--
-- Name: terminology_collection_concept_concept_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_collection_concept_concept_id_idx ON public.terminology_collection_concept USING btree (concept_id);


--
-- Name: terminology_collection_mapping_collection_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_collection_mapping_collection_id_idx ON public.terminology_collection_mapping USING btree (collection_id);


--
-- Name: terminology_collection_mapping_mapping_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_collection_mapping_mapping_id_idx ON public.terminology_collection_mapping USING btree (mapping_id);


--
-- Name: terminology_collection_org_unit_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_collection_org_unit_id_idx ON public.terminology_collection USING btree (org_unit_id);


--
-- Name: terminology_source_org_unit_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX terminology_source_org_unit_id_idx ON public.terminology_source USING btree (org_unit_id);


--
-- Name: user_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_active_idx ON public."user" USING btree (active);


--
-- Name: user_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_token_idx ON public."user" USING btree (token);


--
-- Name: org_unit process_org_unit_descendants; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER process_org_unit_descendants AFTER INSERT OR UPDATE ON public.org_unit FOR EACH ROW WHEN ((pg_trigger_depth() = 0)) EXECUTE PROCEDURE public.set_org_unit_descendants();


--
-- Name: org_unit process_org_unit_path; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER process_org_unit_path BEFORE INSERT OR UPDATE ON public.org_unit FOR EACH ROW EXECUTE PROCEDURE public.set_default_path();


--
-- Name: concept_aggregation concept_aggregation_concept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);


--
-- Name: concept_aggregation concept_aggregation_state_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept_aggregation
    ADD CONSTRAINT concept_aggregation_state_type_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(id);


--
-- Name: concept concept_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.concept_class(id);


--
-- Name: concept concept_data_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_data_type_id_fkey FOREIGN KEY (data_type_id) REFERENCES public.data_type(id);


--
-- Name: concept concept_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concept
    ADD CONSTRAINT concept_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.terminology_source(id);


--
-- Name: encounter encounter_entity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entity(id);


--
-- Name: encounter encounter_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: encounter encounter_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public."user"(id);


--
-- Name: encounter encounter_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.state(id);


--
-- Name: encounter_type_concept encounter_type_concept_concept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);


--
-- Name: encounter_type_concept encounter_type_concept_encounter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_concept
    ADD CONSTRAINT encounter_type_concept_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);


--
-- Name: encounter_type encounter_type_entity_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type
    ADD CONSTRAINT encounter_type_entity_type_id_fkey FOREIGN KEY (entity_type_id) REFERENCES public.entity_type(id);


--
-- Name: encounter encounter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter
    ADD CONSTRAINT encounter_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.encounter_type(id);


--
-- Name: encounter_type_permission encounter_type_permission_encounter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);


--
-- Name: encounter_type_permission encounter_type_permission_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_permission
    ADD CONSTRAINT encounter_type_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: encounter_type_stage encounter_type_state_type_encounter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage
    ADD CONSTRAINT encounter_type_state_type_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);


--
-- Name: encounter_type_stage encounter_type_state_type_state_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage
    ADD CONSTRAINT encounter_type_state_type_state_type_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(id);


--
-- Name: encounter_type_stage_transition encounter_type_state_type_step_encounter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage_transition
    ADD CONSTRAINT encounter_type_state_type_step_encounter_type_id_fkey FOREIGN KEY (encounter_type_id) REFERENCES public.encounter_type(id);


--
-- Name: encounter_type_stage_transition encounter_type_state_type_step_state_type_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounter_type_stage_transition
    ADD CONSTRAINT encounter_type_state_type_step_state_type_step_id_fkey FOREIGN KEY (stage_transition_id) REFERENCES public.stage_transition(id);


--
-- Name: entity_type_concept entity_type_concept_concept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);


--
-- Name: entity_type_concept entity_type_concept_entity_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_type_concept
    ADD CONSTRAINT entity_type_concept_entity_type_id_fkey FOREIGN KEY (entity_type_id) REFERENCES public.entity_type(id);


--
-- Name: entity entity_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity
    ADD CONSTRAINT entity_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.entity_type(id);


--
-- Name: mapping mapping_from_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_from_id_fkey FOREIGN KEY (from_id) REFERENCES public.concept(id);


--
-- Name: mapping mapping_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.terminology_source(id);


--
-- Name: mapping mapping_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_to_id_fkey FOREIGN KEY (to_id) REFERENCES public.concept(id);


--
-- Name: mapping mapping_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapping
    ADD CONSTRAINT mapping_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.mapping_type(id);


--
-- Name: org_unit org_unit_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_parent_fkey FOREIGN KEY (parent_id) REFERENCES public.org_unit(id);


--
-- Name: org_unit org_unit_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit
    ADD CONSTRAINT org_unit_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.org_unit_type(id);


--
-- Name: org_unit_type_mapping org_unit_type_mapping_from_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_from_id_fkey FOREIGN KEY (from_id) REFERENCES public.org_unit_type(id);


--
-- Name: org_unit_type_mapping org_unit_type_mapping_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_unit_type_mapping
    ADD CONSTRAINT org_unit_type_mapping_to_id_fkey FOREIGN KEY (to_id) REFERENCES public.org_unit_type(id);


--
-- Name: role_attribution role_attribution_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: role_attribution role_attribution_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: role_attribution role_attribution_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribution
    ADD CONSTRAINT role_attribution_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: state state_entity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entity(id);


--
-- Name: state state_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: state state_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.state
    ADD CONSTRAINT state_type_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(id);


--
-- Name: stage_transition state_type_step_next_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_next_step_id_fkey FOREIGN KEY (next_id) REFERENCES public.stage(id);


--
-- Name: stage_transition state_type_step_previous_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage_transition
    ADD CONSTRAINT state_type_step_previous_step_id_fkey FOREIGN KEY (previous_id) REFERENCES public.stage(id);


--
-- Name: stage state_type_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT state_type_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.workflow(id);


--
-- Name: terminology_collection_concept terminology_collection_concept_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.terminology_collection(id);


--
-- Name: terminology_collection_concept terminology_collection_concept_concept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_concept
    ADD CONSTRAINT terminology_collection_concept_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concept(id);


--
-- Name: terminology_collection_mapping terminology_collection_mapping_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.terminology_collection(id);


--
-- Name: terminology_collection_mapping terminology_collection_mapping_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection_mapping
    ADD CONSTRAINT terminology_collection_mapping_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES public.mapping(id);


--
-- Name: terminology_collection terminology_collection_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_collection
    ADD CONSTRAINT terminology_collection_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: terminology_source terminology_source_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminology_source
    ADD CONSTRAINT terminology_source_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: user_org_unit user_orgunit_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_orgunit_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: user_org_unit user_orgunit_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_org_unit
    ADD CONSTRAINT user_orgunit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user user_preferred_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_preferred_org_unit_id_fkey FOREIGN KEY (preferred_org_unit_id) REFERENCES public.org_unit(id);


--
-- Name: user_role user_role_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: user_role user_role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

