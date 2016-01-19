<?php
if( have_rows('mass_schedule') ):

    // (parent repeater)
    while( have_rows('mass_schedule') ): the_row(); ?>
        <div class="u-1of1 u-text-right u-py1 u-border-t">
            <div class="u-h3 u-inline-block u-1of3 title">
                <?php the_sub_field('title'); ?>
            </div>

            <?php while( have_rows('mass_times') ): the_row(); ?>
                <?php
                $labels = array();
                $field = get_sub_field_object('day');
                $values = get_sub_field('day');
                foreach ($values as $value) {
                $labels[] = $field['choices'][ $value ];
                } ?>
                <div class="u-inline-block u-1of3 days u-py1">
                    <?php foreach ($labels as $label) {echo $label.', ';} ?>
                </div>

                <?php if( have_rows('group_time') ): ?>
                    <div class="u-inline-block u-1of3 times">
                        <?php while( have_rows('group_time') ): the_row(); ?>
                            <?php the_sub_field('time'); ?>
                        <?php endwhile; ?>
                    </div>
                <?php endif; // have_rows('group_time') ): ?>

            <?php endwhile; ?>

        </div>
    <?php endwhile; // have_rows('mass_schedule') ): ?>

<?php
endif; // have_rows('mass_schedule') )
