let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  packages = [
    (pkgs.python3.withPackages (python-pkgs: [
      python-pkgs.flask
      python-pkgs.pip
      python-pkgs.flask_sqlalchemy
    ]))
    pkgs.sqlite
  ];
}