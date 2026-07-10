require "shellwords"

set :application, "dentest_client"
set :repo_url, "git@github.com:entest-project/client.git"
set :deploy_to, ENV['DEPLOY_DIR']
append :linked_files, ".env"
set :keep_releases, 5

server ENV['DEPLOY_TO'], user: "deployer-agent"

def build_env
  api_url = ENV["NUXT_PUBLIC_API_URL"] || ENV["API_URL"]
  ketal_url = ENV["NUXT_PUBLIC_KETAL_URL"] || ENV["KETAL_URL"]

  {
    "API_URL" => api_url,
    "NUXT_PUBLIC_API_URL" => api_url,
    "KETAL_URL" => ketal_url,
    "NUXT_PUBLIC_KETAL_URL" => ketal_url
  }.map { |key, value| value && !value.empty? ? "#{key}=#{Shellwords.escape(value)}" : nil }
    .compact
    .join(" ")
end

task :install do
  on roles(:all) do |h|
     execute "cd #{release_path} && npm install"
     execute "cd #{release_path} && #{[build_env, 'npm run build'].reject(&:empty?).join(' ')}"
  end
end

task :start do
  on roles(:all) do |h|
    execute "cd #{release_path} && sudo fuser -k -n tcp #{ENV['PORT']} || true"
    execute "sudo supervisorctl restart dentest_client"
  end
end

after "deploy:updated", :install
after "deploy:publishing", :start
