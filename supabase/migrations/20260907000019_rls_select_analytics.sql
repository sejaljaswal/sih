-- PRD §8.2 — AI forecasts row: Customer —, Worker —, Society Admin R (soc),
-- Federation Admin R (fed), Super Admin R (+ retrain, a server-side operation).
-- daily_demand_stats is the aggregate the forecast is trained from (PRD §11.4);
-- same audience as demand_forecasts.
create policy daily_demand_stats_select_society_admin on daily_demand_stats for select using (
  society_id = auth_society_id()
);

create policy daily_demand_stats_select_federation_admin on daily_demand_stats for select using (
  society_id in (select id from societies where federation_id = auth_federation_id())
);

create policy daily_demand_stats_select_super_admin on daily_demand_stats for select using (
  auth_role() = 'SUPER_ADMIN'
);

create policy demand_forecasts_select_society_admin on demand_forecasts for select using (
  society_id = auth_society_id()
);

create policy demand_forecasts_select_federation_admin on demand_forecasts for select using (
  society_id in (select id from societies where federation_id = auth_federation_id())
);

create policy demand_forecasts_select_super_admin on demand_forecasts for select using (
  auth_role() = 'SUPER_ADMIN'
);
