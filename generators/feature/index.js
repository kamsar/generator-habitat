'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var guid = require('node-uuid');
var path = require('path');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the slick ' + chalk.red('Sitecore Habitat Feature') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'featureTitle',
      message: 'Enter the name of your feature:'
    },
    {
      type: 'confirm',
      name: 'createTests',
      message: 'Create unit test project (DO IT!):',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.projectGuid = '{' + guid.v4() + '}';
      this.props.testProjectGuid = '{' + guid.v4() + '}';

      done();
    }.bind(this));
  },

  writing: function () {
    var targetPath = path.join('src', 'Feature', this.props.featureTitle);

    /*********** CODE ***************/
    this.fs.copy(
      this.templatePath('code/**/*'),
      this.destinationPath(path.join(targetPath, 'code'))
    );

    // csproj
    this.fs.copyTpl(
      this.templatePath('Sitecore.Feature.csproj'),
      this.destinationPath(path.join(targetPath, 'code', 'Sitecore.Feature.' + this.props.featureTitle + '.csproj')),
      this.props
    );

    // AssemblyInfo.cs, project
    this.fs.copyTpl(
      this.templatePath('AssemblyInfo.cs'),
      this.destinationPath(path.join(targetPath, 'code', 'Properties', 'AssemblyInfo.cs')),
      { assemblyName: 'Sitecore.Feature.' + this.props.featureTitle }
    );

    // config
    this.fs.copyTpl(
      this.templatePath('Feature.config'),
      this.destinationPath(path.join(targetPath, 'code', 'App_Config', 'Include', 'Feature', 'Feature.' + this.props.featureTitle + '.config')),
      this.props
    );

    // serialization config
    this.fs.copyTpl(
      this.templatePath('Feature.Serialization.config'),
      this.destinationPath(path.join(targetPath, 'code', 'App_Config', 'Include', 'Feature', 'Feature.' + this.props.featureTitle + '.Serialization.config')),
      this.props
    );

    /*********** TESTS ***************/

    if(this.props.createTests) {
      this.fs.copy(
        this.templatePath('tests/**/*'),
        this.destinationPath(path.join(targetPath, 'tests'))
      );

      // tests csproj
      this.fs.copyTpl(
        this.templatePath('Sitecore.Feature.Tests.csproj'),
        this.destinationPath(path.join(targetPath, 'tests', 'Sitecore.Feature.' + this.props.featureTitle + '.Tests.csproj')),
        this.props
      );

      // AssemblyInfo.cs, tests
      this.fs.copyTpl(
        this.templatePath('AssemblyInfo.cs'),
        this.destinationPath(path.join(targetPath, 'tests', 'Properties', 'AssemblyInfo.cs')),
        { assemblyName: 'Sitecore.Feature.' + this.props.featureTitle }
      );
    }

    /*********** SERIALIZATION ***************/

    // renderings YML
    this.fs.copyTpl(
      this.templatePath('Renderings.yml'),
      this.destinationPath(path.join(targetPath, 'serialization', 'Renderings', this.props.featureTitle + '.yml')),
      this.props
    );

    // templates YML
    this.fs.copyTpl(
      this.templatePath('Templates.yml'),
      this.destinationPath(path.join(targetPath, 'serialization', 'Templates', this.props.featureTitle + '.yml')),
      this.props
    );
  },

  end: function() {
    console.log('');
    console.log('Your feature ' + chalk.red(this.props.featureTitle) + ' has been created');
    console.log('You will need to add your feature project(s) to your Visual Studio solution.');
  }
});