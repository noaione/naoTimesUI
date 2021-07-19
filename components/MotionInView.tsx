import React, { useEffect } from "react";

import {
    HTMLMotionProps,
    motion,
    MotionProps,
    TargetAndTransition,
    useAnimation,
    Variants,
} from "framer-motion";
import { ControlsAnimationDefinition } from "framer-motion/types/animation/types";

import { useInView } from "react-intersection-observer";
import { TargetResolver } from "framer-motion/types/types";

export interface MotionViewVariants extends Variants {
    hidden?: TargetAndTransition | TargetResolver;
    visible?: TargetAndTransition | TargetResolver;
}

function MotionInViewDiv(props: MotionProps & HTMLMotionProps<"div">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.div {...props} ref={ref} animate={controls} />;
}

function MotionInViewMain(props: MotionProps & HTMLMotionProps<"main">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.main {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewHead1(props: MotionProps & HTMLMotionProps<"h1">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.h1 {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewHead2(props: MotionProps & HTMLMotionProps<"h2">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.h2 {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewHeader(props: MotionProps & HTMLMotionProps<"header">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.header {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewImage(props: MotionProps & HTMLMotionProps<"img">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.img {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewButton(props: MotionProps & HTMLMotionProps<"button">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.button {...props} ref={ref} initial="hidden" animate={controls} />;
}

function MotionInViewParagraph(props: MotionProps & HTMLMotionProps<"p">) {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            if (typeof props.animate !== "boolean") {
                controls.start(props.animate as ControlsAnimationDefinition);
            }
        }
    }, [controls, inView, props.animate]);

    return <motion.p {...props} ref={ref} initial="hidden" animate={controls} />;
}

const MotionInView = {
    button: MotionInViewButton,
    div: MotionInViewDiv,
    h1: MotionInViewHead1,
    h2: MotionInViewHead2,
    header: MotionInViewHeader,
    img: MotionInViewImage,
    main: MotionInViewMain,
    p: MotionInViewParagraph,
};

export default MotionInView;
