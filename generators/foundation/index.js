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
      'Welcome to the slick ' + chalk.red('Sitecore Habitat Foundation') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'foundationTitle',
      message: 'Enter the name of your foundation module:'
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
      this.props.templateItemGuid = guid.v4();
      this.props.renderingItemGuid = guid.v4();

      done();
    }.bind(this));
  },

  writing: function () {
    var targetPath = path.join('src', 'Foundation', this.props.foundationTitle);

    /*********** CODE ***************/
    this.fs.copy(
      this.templatePath('code/**/*'),
      this.destinationPath(path.join(targetPath, 'code'))
    );

    // csproj
    this.fs.copyTpl(
      this.templatePath('Sitecore.Foundation.csproj'),
      this.destinationPath(path.join(targetPath, 'code', 'Sitecore.Foundation.' + this.props.foundationTitle + '.csproj')),
      this.props
    );

    // AssemblyInfo.cs, project
    this.fs.copyTpl(
      this.templatePath('AssemblyInfo.cs'),
      this.destinationPath(path.join(targetPath, 'code', 'Properties', 'AssemblyInfo.cs')),
      { assemblyName: 'Sitecore.Foundation.' + this.props.foundationTitle }
    );

    // config
    this.fs.copyTpl(
      this.templatePath('Foundation.config'),
      this.destinationPath(path.join(targetPath, 'code', 'App_Config', 'Include', 'Foundation', 'Foundation.' + this.props.foundationTitle + '.config')),
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
        this.templatePath('Sitecore.Foundation.Tests.csproj'),
        this.destinationPath(path.join(targetPath, 'tests', 'Sitecore.Foundation.' + this.props.foundationTitle + '.Tests.csproj')),
        this.props
      );

      // AssemblyInfo.cs, tests
      this.fs.copyTpl(
        this.templatePath('AssemblyInfo.cs'),
        this.destinationPath(path.join(targetPath, 'tests', 'Properties', 'AssemblyInfo.cs')),
        { assemblyName: 'Sitecore.Foundation.' + this.props.foundationTitle }
      );
    }
  },

  end: function() {
    console.log('');
    console.log('Your foundation module ' + chalk.red(this.props.foundationTitle) + ' has been created');
    console.log('');
    console.log('You will need to add your foundation project(s) to your Visual Studio solution.');
    console.log('Then build and publish the foundation project from Visual Studio.');
  }
});