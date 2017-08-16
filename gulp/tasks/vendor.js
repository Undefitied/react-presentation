import gulp from 'gulp';
import liveReload from 'gulp-livereload';
import config from '../config';

gulp.task('vendor', ['clean:vendor'], function() {
    return gulp.src(`${config.ASSETS_VENDOR}/**/*.js`)
            .pipe(gulp.dest(config.STATIC_VENDOR))
            .pipe(liveReload());
});
