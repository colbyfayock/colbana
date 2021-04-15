module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {

            options: {
                separator: ';'
            },

            us: {
                src: [

                    // Bower components

                    './bower_components/modernizr/modernizr.js',
                    './bower_components/photoswipe/dist/photoswipe.js',
                    './bower_components/photoswipe/dist/photoswipe-ui-default.js',
                    './bower_components/hippify/hippify/hippify.js',

                    './build/us/js/components/**/*.js',


                    // Main

                    './build/us/js/main.js'

                ],
                dest: './us/js/colbana.js',
            },

            br: {
                src: [

                    // Bower components

                    './bower_components/modernizr/modernizr.js',
                    './bower_components/photoswipe/dist/photoswipe.js',
                    './bower_components/photoswipe/dist/photoswipe-ui-default.js',
                    './bower_components/hippify/hippify/hippify.js',

                    './build/br/js/components/**/*.js',


                    // Main

                    './build/br/js/main.js'

                ],
                dest: './br/js/colbana.js',
            },

        },

        uglify: {

            options: {
                banner: '/*\n' +
                    ' * <%= pkg.name %>\n' +
                    ' */\n',
                mangle: false,
                compress: false
            },

            us: {
                files: {
                    './us/js/colbana.min.js': [
                        './us/js/colbana.js'
                    ]
                }
            },

            br: {
                files: {
                    './br/js/colbana.min.js': [
                        './br/js/colbana.js'
                    ]
                }
            }

        },

        sass: {

            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },

            us: {
                files: {
                    './us/css/colbana.min.css': './build/us/scss/main.scss'
                }
            },

            br: {
                files: {
                    './br/css/colbana.min.css': './build/br/scss/main.scss'
                }
            }

        },

        watch: {

            us_css: {
                files: './build/us/scss/**/*.scss',
                tasks: [
                    'us_css'
                ]
            },

            us_js: {
                files: './build/us/js/**/*.js',
                tasks: [
                    'us_js'
                ]
            },

            br_css: {
                files: './build/br/scss/**/*.scss',
                tasks: [
                    'br_css'
                ]
            },

            br_js: {
                files: './build/br/js/**/*.js',
                tasks: [
                    'br_js'
                ]
            }

        }

    });

    grunt.registerTask('us_css', [
        'sass:us'
    ]);

    grunt.registerTask('br_css', [
        'sass:br'
    ]);

    grunt.registerTask('us_js', [
        'concat:us',
        'uglify:us'
    ]);

    grunt.registerTask('br_js', [
        'concat:br',
        'uglify:br'
    ]);

    grunt.registerTask('build_us', [
        'us_css',
        'us_js'
    ]);

    grunt.registerTask('build_br', [
        'br_css',
        'br_js'
    ]);

};