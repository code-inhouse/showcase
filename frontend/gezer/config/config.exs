# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

default_locale = "en"
locales = ~w(en ru uk)

config :core,
  ecto_repos: [Core.Repo]

# Configures the endpoint
config :core, CoreWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "S/8FytKdiQ0mrbJkH+Hx3+kdegKv7U+IxQQwiWsqXZkvltza2HV9E+MEZJj8Dqwk",
  render_errors: [view: CoreWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Core.PubSub, adapter: Phoenix.PubSub.PG2],
  default_locale: default_locale,
  locales: locales

config :core, CoreWeb.Gettext,
  default_locale: default_locale,
  locales: locales

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
