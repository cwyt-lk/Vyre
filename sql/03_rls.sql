/* =========================================================
   ROW LEVEL SECURITY POLICIES
========================================================= */

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table artists        enable row level security;
alter table genres         enable row level security;
alter table albums         enable row level security;
alter table tracks         enable row level security;
alter table track_artists  enable row level security;
alter table album_tracks   enable row level security;


-- =========================================================
-- 1. PUBLIC READ ACCESS
-- =========================================================

create policy artists_read_all
on artists for select
to public
using (true);

create policy genres_read_all
on genres for select
to public
using (true);

create policy albums_read_all
on albums for select
to public
using (true);

create policy tracks_read_all
on tracks for select
to public
using (true);

create policy track_artists_read_all
on track_artists for select
to public
using (true);

create policy album_tracks_read_all
on album_tracks for select
to public
using (true);


-- =========================================================
-- 2. ADMIN WRITE ACCESS
-- =========================================================

-- Artists
create policy artists_insert_admin
on artists for insert
to authenticated
with check (public.check_role('admin'));

create policy artists_update_admin
on artists for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy artists_delete_admin
on artists for delete
to authenticated
using (public.check_role('admin'));


-- Genres
create policy genres_insert_admin
on genres for insert
to authenticated
with check (public.check_role('admin'));

create policy genres_update_admin
on genres for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy genres_delete_admin
on genres for delete
to authenticated
using (public.check_role('admin'));


-- Albums
create policy albums_insert_admin
on albums for insert
to authenticated
with check (public.check_role('admin'));

create policy albums_update_admin
on albums for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy albums_delete_admin
on albums for delete
to authenticated
using (public.check_role('admin'));


-- Tracks
create policy tracks_insert_admin
on tracks for insert
to authenticated
with check (public.check_role('admin'));

create policy tracks_update_admin
on tracks for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy tracks_delete_admin
on tracks for delete
to authenticated
using (public.check_role('admin'));


-- Track <-> Artists
create policy track_artists_insert_admin
on track_artists for insert
to authenticated
with check (public.check_role('admin'));

create policy track_artists_update_admin
on track_artists for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy track_artists_delete_admin
on track_artists for delete
to authenticated
using (public.check_role('admin'));


-- Album <-> Tracks
create policy album_tracks_insert_admin
on album_tracks for insert
to authenticated
with check (public.check_role('admin'));

create policy album_tracks_update_admin
on album_tracks for update
to authenticated
using (public.check_role('admin'))
with check (public.check_role('admin'));

create policy album_tracks_delete_admin
on album_tracks for delete
to authenticated
using (public.check_role('admin'));