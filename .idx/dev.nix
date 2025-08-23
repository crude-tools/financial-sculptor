# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [ pkgs.nodejs_20 ];

  # Workspace lifecycle hooks
  idx.workspace = {
    # Runs EVERY TIME the workspace starts.
    # This guarantees our tools are always installed.
    onStart = {
      install-dependencies = "npm install";
    };
  };

  # Enable previews
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [ "npm" "start" ];
        manager = "web";
      };
    };
  };
}