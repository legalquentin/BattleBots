CREATE TABLE public.battle
(
    id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_995fe4fbf64982dd97e7c59e760" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.battle
    OWNER to root;

CREATE TABLE public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    pseudo character varying COLLATE pg_catalog."default" NOT NULL,
    firstname character varying COLLATE pg_catalog."default" NOT NULL,
    lastname character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."user"
    OWNER to root;

CREATE TABLE public.user_battle
(
    id integer NOT NULL DEFAULT nextval('user_battle_id_seq'::regclass),
    battle_id integer NOT NULL,
    user_game_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_7246e8b21f050d62a4a7715b8ae" PRIMARY KEY (id),
    CONSTRAINT fk_battle_id FOREIGN KEY (battle_id)
        REFERENCES public.battle (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_user_game_user_game_id FOREIGN KEY (user_game_id)
        REFERENCES public.user_game (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_battle
    OWNER to root;

-- Table: public.user_game

-- DROP TABLE public.user_game;

CREATE TABLE public.user_game
(
    id integer NOT NULL DEFAULT nextval('user_game_id_seq'::regclass),
    user_id integer NOT NULL,
    health integer NOT NULL,
    damage integer NOT NULL,
    level integer NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_4ad0dcdcd6b1d348407ae324fd0" PRIMARY KEY (id),
    CONSTRAINT fk_user_game_user_id FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_game
    OWNER to root;
