class matchmyresume {						

  # 1. Install required packages
  package { ['nodejs', 'npm', 'git', 'nginx']:
    ensure => installed,
  }

  # 2. Ensure Nginx service is running
  service { 'nginx':
    ensure => running,
    enable => true,
  }

  # 3. Create project directory
  file { '/var/www/matchmyresume':
    ensure => directory,
    owner  => 'ubuntu',
    mode   => '0755',
  }

  # 4. Clone the repository
  exec { 'clone_repo':
    command => '/usr/bin/git clone https://github.com/sahilsingh12221802/MatchMy-Resume.git /var/www/matchmyresume',
    creates => '/var/www/matchmyresume/package.json',
    path    => ['/usr/bin', '/bin'],
    require => Package['git'],
  }

# 5. Install Node.js dependencies
  exec { 'install_dependencies':
    command => '/usr/bin/npm install',
    cwd     => '/var/www/matchmyresume',
    path    => ['/usr/bin', '/bin'],
    require => Exec['clone_repo'],
  }
}

include matchmyresume
