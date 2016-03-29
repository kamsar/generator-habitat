'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the slick ' + chalk.red('Sitecore Habitat') + ' generator!'
    ));

    console.log('Before generating Habitat, make sure to install a copy of Sitecore using SIM, with WFFM.')
    console.log('');
    console.log(chalk.red('YOU MUST RUN THIS GENERATOR AS AN ADMINISTRATOR.'));

    var prompts = [{
      type: 'input',
      name: 'sitecoreFolder',
      message: 'Where is your Sitecore webroot for Habitat to use: ',
      default: 'C:\\websites\\habitat.local\\Website'
    },
    {
      type: 'input',
      name: 'hostName',
      message: 'What is the URL for this site: ',
      default: 'http://habitat.local'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someAnswer;

      done();
    }.bind(this));
  },

  writing: function () {
    var done = this.async();

    var parentThis = this;

    var habitatGit = 'https://github.com/Sitecore/Habitat.git';

    this.spawnCommand('git', ['clone', habitatGit, this.destinationRoot()])
      .on('close', function() {

        /*************** SET PATHS *************/
        parentThis.conflicter.force = true;

        parentThis.fs.copy(
          parentThis.destinationPath('gulp-config.js'),
          parentThis.destinationPath('gulp-config.js'),
          {
            process: function(content) {
              return content.toString().replace(/C:\\\\websites\\\\Habitat\.local\\\\Website/gi, parentThis.props.sitecoreFolder.replace(/\\/g, '\\\\'));
            }
          }
        );

        var destinationConfig = parentThis.destinationPath(path.join('src', 'Project', 'Habitat', 'code', 'App_Config', 'Include', 'Project', 'z.Habitat.DevSettings.config'));

        parentThis.fs.copy(
          destinationConfig,
          destinationConfig, 
          {
            process: function(content) {
             return content.toString().replace(/C:\\projects\\Habitat/gi, parentThis.destinationRoot());
            }
          }        
        );

        parentThis.fs.copy(
          parentThis.destinationPath('publishsettings.targets'),
          parentThis.destinationPath('publishsettings.targets'),
          {
            process: function(content) {
              return content.toString().replace(/http:\/\/habitat\.local/gi, parentThis.props.hostName);
            }
          }
        );

        done();
      });
  },

  install: function () {
    this.npmInstall();
  },

  end: function() {
    var done = this.async();
    var that = this;

    console.log('Deploying the site with Gulp...');

    this.spawnCommand('node', [path.join(this.destinationRoot(), 'node_modules', 'gulp', 'bin', 'gulp.js')])
      .on('close', function() {
        console.log('Deployment is complete.');

        console.log('You can find your new Habitat site at ' + chalk.green(that.props.hostName));

        done();
      });
  }
});
