import gulp from 'gulp';
import liveReload from 'gulp-livereload';
import config from '../config';

gulp.task('videos', ['clean:videos'], function() {
    return gulp.src(`${config.ASSETS_VIDEOS}/**/*.mp4`)
            .pipe(gulp.dest(config.STATIC_VIDEOS))
            .pipe(liveReload());
});
