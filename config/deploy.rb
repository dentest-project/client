set :application, "dentest_client"
set :repo_url, "git@github.com:entest-project/client.git"
set :deploy_to, ENV['DEPLOY_DIR']
append :linked_files, ".env"
set :keep_releases, 5

server ENV['DEPLOY_TO'], user: "deployer-agent"

task :install do
  on roles(:all) do |h|
     execute "cd #{release_path} && npm install"
     execute "cd #{release_path} && npm run build"
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
