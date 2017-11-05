module.exports = function(grunt) {

    require('jit-grunt')(grunt, {
        cloudfront: 'grunt-aws'
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),

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

        aws_s3: {

            options: {
                accessKeyId: '<%= config.aws.accessKeyId %>',
                secretAccessKey: '<%= config.aws.secretAccessKey %>',
                differential: true,
                uploadConcurrency: 5,
                downloadConcurrency: 5
            },
            
            us: {
                options: {
                    bucket: 'colbana.com',
                    region: 'us-east-1'
                },
                files: [
                    {
                        expand: true,
                        cwd: './us',
                        src: ['**'],
                        dest: '/'
                    }
                ]
            },

            br: {
                options: {
                    bucket: 'colbana.com.br',
                    region: 'sa-east-1'
                },
                files: [
                    {
                        expand: true,
                        cwd: './br',
                        src: ['**'],
                        dest: '/'
                    }
                ]
            },

        },

        cloudfront: {
            options: {
                accessKeyId: '<%= config.aws.accessKeyId %>',
                secretAccessKey: '<%= config.aws.secretAccessKey %>'
            },
            us: {
                options: {
                    distributionId: '<%= config.aws.buckets.colbanacom.cloudfrontDistributionId %>'
                }
            },
            br: {
                options: {
                    distributionId: '<%= config.aws.buckets.colbanacombr.cloudfrontDistributionId %>'
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

    // Pulls in the changed files from aws_s3 at run time and pass them
    // into cloudfront invalidation

    grunt.registerTask('invalidate_cache', 'Invalidate Cloudfront from aws_s3 output', function (subtask) {

        var aws_changed = grunt.config.get('aws_s3_changed'),
            task = 'cloudfront',
            changed_files;

        if ( !Array.isArray(aws_changed) ) {
            console.log('Changed files is not an array');
            return;
        }

        changed_files = aws_changed.map(function(file) {
            return '/' + file;
        });

        if ( subtask ) {
            task = task + ':' + subtask;
        }

        grunt.config.set('cloudfront.options.invalidations', changed_files);

        if ( !Array.isArray(changed_files) || changed_files.length === 0 ) {
            console.log('No files changed');
            return;
        }

        grunt.task.run(task);

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

    grunt.registerTask('deployus', [
        'us_css',
        'us_js',
        'aws_s3:us',
        'invalidate_cache:us'
    ]);

    grunt.registerTask('deploybr', [
        'br_css',
        'br_js',
        'aws_s3:br',
        'invalidate_cache:br'
    ]);

};