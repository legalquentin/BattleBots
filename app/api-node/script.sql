--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Debian 11.5-3.pgdg90+1)
-- Dumped by pg_dump version 11.5 (Debian 11.5-3.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: arena; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.arena (
    id integer NOT NULL,
    arena_name character varying NOT NULL,
    available integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.arena OWNER TO root;

--
-- Name: arena_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.arena_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.arena_id_seq OWNER TO root;

--
-- Name: arena_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.arena_id_seq OWNED BY public.arena.id;


--
-- Name: effect; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.effect (
    id integer NOT NULL,
    name character varying NOT NULL,
    duration integer NOT NULL,
    formula integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.effect OWNER TO root;

--
-- Name: effect_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.effect_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.effect_id_seq OWNER TO root;

--
-- Name: effect_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.effect_id_seq OWNED BY public.effect.id;


--
-- Name: effect_user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.effect_user (
    id integer NOT NULL,
    effect_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.effect_user OWNER TO root;

--
-- Name: games; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.games (
    id integer NOT NULL,
    game_name character varying NOT NULL,
    arena_id integer NOT NULL,
    game_status integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.games OWNER TO root;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO root;

--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: robots; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.robots (
    id integer NOT NULL,
    bot_ip character varying NOT NULL,
    running integer NOT NULL,
    taken integer NOT NULL,
    name character varying NOT NULL,
    speed integer NOT NULL,
    damage integer NOT NULL,
    fire_rate integer NOT NULL,
    armor integer NOT NULL,
    player_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.robots OWNER TO root;

--
-- Name: robots_arena; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.robots_arena (
    id integer NOT NULL,
    bot_id integer NOT NULL,
    arena_id integer NOT NULL
);


ALTER TABLE public.robots_arena OWNER TO root;

--
-- Name: robots_arena_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.robots_arena_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.robots_arena_id_seq OWNER TO root;

--
-- Name: robots_arena_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.robots_arena_id_seq OWNED BY public.robots_arena.id;


--
-- Name: robots_game; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.robots_game (
    id integer NOT NULL,
    bot_id integer NOT NULL,
    game_id integer NOT NULL
);


ALTER TABLE public.robots_game OWNER TO root;

--
-- Name: robots_game_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.robots_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.robots_game_id_seq OWNER TO root;

--
-- Name: robots_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.robots_game_id_seq OWNED BY public.robots_game.id;


--
-- Name: robots_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.robots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.robots_id_seq OWNER TO root;

--
-- Name: robots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.robots_id_seq OWNED BY public.robots.id;


--
-- Name: spell; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.spell (
    id integer NOT NULL,
    name character varying NOT NULL,
    formula character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.spell OWNER TO root;

--
-- Name: spell_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.spell_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.spell_id_seq OWNER TO root;

--
-- Name: spell_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.spell_id_seq OWNED BY public.spell.id;


--
-- Name: stat_user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.stat_user (
    id integer NOT NULL,
    dead_number integer NOT NULL,
    kill_number integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.stat_user OWNER TO root;

--
-- Name: stat_user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.stat_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stat_user_id_seq OWNER TO root;

--
-- Name: stat_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.stat_user_id_seq OWNED BY public.stat_user.id;


--
-- Name: streams; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.streams (
    id integer NOT NULL,
    game_id integer NOT NULL,
    robot_id integer NOT NULL,
    kinesis_url character varying NOT NULL,
    s3_url character varying NOT NULL,
    private integer NOT NULL,
    running integer NOT NULL,
    duration integer NOT NULL,
    encodage character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.streams OWNER TO root;

--
-- Name: streams_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.streams_id_seq OWNER TO root;

--
-- Name: streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.streams_id_seq OWNED BY public.streams.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    pseudo character varying NOT NULL,
    email character varying NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    address character varying NOT NULL,
    hash character varying NOT NULL,
    salt character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: arena id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.arena ALTER COLUMN id SET DEFAULT nextval('public.arena_id_seq'::regclass);


--
-- Name: effect id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.effect ALTER COLUMN id SET DEFAULT nextval('public.effect_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: robots id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots ALTER COLUMN id SET DEFAULT nextval('public.robots_id_seq'::regclass);


--
-- Name: robots_arena id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_arena ALTER COLUMN id SET DEFAULT nextval('public.robots_arena_id_seq'::regclass);


--
-- Name: robots_game id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_game ALTER COLUMN id SET DEFAULT nextval('public.robots_game_id_seq'::regclass);


--
-- Name: spell id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.spell ALTER COLUMN id SET DEFAULT nextval('public.spell_id_seq'::regclass);


--
-- Name: stat_user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stat_user ALTER COLUMN id SET DEFAULT nextval('public.stat_user_id_seq'::regclass);


--
-- Name: streams id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.streams ALTER COLUMN id SET DEFAULT nextval('public.streams_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: arena; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.arena (id, arena_name, available, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: effect; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.effect (id, name, duration, formula, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: effect_user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.effect_user (id, effect_id, user_id) FROM stdin;
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.games (id, game_name, arena_id, game_status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1572537760733	User1572537760733
2	1572776513129	spell1572776513129
3	1572778879472	effect1572778879472
4	1572780397289	effectUser1572780397289
5	1572780862610	statUser1572780862610
6	1580907447839	Arena1580907447839
7	1580907456635	Games1580907456635
8	1580907469348	Robots1580907469348
9	1580913294302	Streams1580913294302
10	1580916156507	RobotsArena1580916156507
11	1580916163727	RobotsGame1580916163727
\.


--
-- Data for Name: robots; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.robots (id, bot_ip, running, taken, name, speed, damage, fire_rate, armor, player_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: robots_arena; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.robots_arena (id, bot_id, arena_id) FROM stdin;
\.


--
-- Data for Name: robots_game; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.robots_game (id, bot_id, game_id) FROM stdin;
\.


--
-- Data for Name: spell; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.spell (id, name, formula, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: stat_user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.stat_user (id, dead_number, kill_number, user_id) FROM stdin;
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.streams (id, game_id, robot_id, kinesis_url, s3_url, private, running, duration, encodage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."user" (id, pseudo, email, firstname, lastname, address, hash, salt, created_at, updated_at) FROM stdin;
\.


--
-- Name: arena_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.arena_id_seq', 1, false);


--
-- Name: effect_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.effect_id_seq', 1, false);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


--
-- Name: robots_arena_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.robots_arena_id_seq', 1, false);


--
-- Name: robots_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.robots_game_id_seq', 1, false);


--
-- Name: robots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.robots_id_seq', 1, false);


--
-- Name: spell_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.spell_id_seq', 1, false);


--
-- Name: stat_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.stat_user_id_seq', 1, false);


--
-- Name: streams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.streams_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: spell PK_148c7e69812f7047fe34e3848fa; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.spell
    ADD CONSTRAINT "PK_148c7e69812f7047fe34e3848fa" PRIMARY KEY (id);


--
-- Name: robots_game PK_20afb32248250e3ba2b1ae89a8f; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_game
    ADD CONSTRAINT "PK_20afb32248250e3ba2b1ae89a8f" PRIMARY KEY (id);


--
-- Name: streams PK_40440b6f569ebc02bc71c25c499; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT "PK_40440b6f569ebc02bc71c25c499" PRIMARY KEY (id);


--
-- Name: robots PK_43f57cdb413e91d08657cb72062; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots
    ADD CONSTRAINT "PK_43f57cdb413e91d08657cb72062" PRIMARY KEY (id);


--
-- Name: arena PK_652b8490f93101a044a90d25a60; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.arena
    ADD CONSTRAINT "PK_652b8490f93101a044a90d25a60" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: robots_arena PK_a6b781bb32a71a1987bdb5ba947; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_arena
    ADD CONSTRAINT "PK_a6b781bb32a71a1987bdb5ba947" PRIMARY KEY (id);


--
-- Name: games PK_c9b16b62917b5595af982d66337; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: effect PK_d9f2bcb19b53f7f26e0b7c484e4; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.effect
    ADD CONSTRAINT "PK_d9f2bcb19b53f7f26e0b7c484e4" PRIMARY KEY (id);


--
-- Name: effect_user PK_daf5fa42781d162008ef55679af; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.effect_user
    ADD CONSTRAINT "PK_daf5fa42781d162008ef55679af" PRIMARY KEY (id);


--
-- Name: stat_user UQ_048c3190c07c8828d4d6fc57477; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stat_user
    ADD CONSTRAINT "UQ_048c3190c07c8828d4d6fc57477" UNIQUE (id);


--
-- Name: user UQ_be726a825c7254f55be1540601a; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_be726a825c7254f55be1540601a" UNIQUE (pseudo);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: spell UQ_f7f62902d24e43ca00323db233c; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.spell
    ADD CONSTRAINT "UQ_f7f62902d24e43ca00323db233c" UNIQUE (name);


--
-- Name: effect_user fk_effect_user_effect_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.effect_user
    ADD CONSTRAINT fk_effect_user_effect_id FOREIGN KEY (effect_id) REFERENCES public.effect(id);


--
-- Name: effect_user fk_effect_user_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.effect_user
    ADD CONSTRAINT fk_effect_user_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: games fk_games_arena_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT fk_games_arena_id FOREIGN KEY (arena_id) REFERENCES public.arena(id);


--
-- Name: robots_arena fk_robots_arena_arena_id_bot; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_arena
    ADD CONSTRAINT fk_robots_arena_arena_id_bot FOREIGN KEY (bot_id) REFERENCES public.robots(id);


--
-- Name: robots_arena fk_robots_arena_bot_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_arena
    ADD CONSTRAINT fk_robots_arena_bot_id FOREIGN KEY (arena_id) REFERENCES public.arena(id);


--
-- Name: robots_game fk_robots_game_bot_game_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_game
    ADD CONSTRAINT fk_robots_game_bot_game_id FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- Name: robots_game fk_robots_game_game_id_bot; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots_game
    ADD CONSTRAINT fk_robots_game_game_id_bot FOREIGN KEY (bot_id) REFERENCES public.robots(id);


--
-- Name: robots fk_robots_player_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.robots
    ADD CONSTRAINT fk_robots_player_id FOREIGN KEY (player_id) REFERENCES public."user"(id);


--
-- Name: stat_user fk_stat_user_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stat_user
    ADD CONSTRAINT fk_stat_user_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: streams fk_streams_game_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT fk_streams_game_id FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- Name: streams fk_streams_robot_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT fk_streams_robot_id FOREIGN KEY (robot_id) REFERENCES public.robots(id);


--
-- PostgreSQL database dump complete
--

