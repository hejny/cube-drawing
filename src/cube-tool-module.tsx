// Note: We are using library destroyable and xyzt which is published under @hejny (creator of Collboard) but probbly it should be also published under @collboard to make clear that it is an integral part of Collboard stack.
import { declareModule, makeIconModuleOnModule, React, SCALE_PIXELS, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, description, license, repository, version } from '../package.json';
import { CubeArt } from './cube-art';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: '@hejny/cube-drawing/cube-tool',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Drawing of cube buildings', cs: 'Kreslení krychlových staveb' },
            keywords: ['Minecraft', 'Lego'],
            categories: ['Basic', 'Art', 'Experimental'],
            icon: '📦',
            flags: {
                isTemplate: true,
            },
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { attributesSystem } = await systems.request('attributesSystem');
            return {
                section: 2,
                icon: '📦',
                boardCursor: 'crosshair',
                menu: () => <>{attributesSystem.inputRender('color')}</>,
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, appState, attributesSystem, materialArtVersioningSystem, collSpace } =
                    await systems.request(
                        'touchController',
                        'appState',
                        'attributesSystem',
                        'materialArtVersioningSystem',
                        'collSpace',
                    );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        async next(touch) {
                            appState.cancelSelection();

                            const cubeArt = new CubeArt(attributesSystem.getAttributeValue('color') as string);
                            let position = (await collSpace.pickPoint(touch.firstFrame.position)).point;

                            // TODO: In sync with grid
                            // TODO: !!! Use SCALE_PIXELS in tool OR art BUT NOT BOTH
                            // TODO: !!! Map in place
                            position = position.map(
                                (value) => Math.round(value / SCALE_PIXELS.field) * SCALE_PIXELS.field,
                            );
                            cubeArt.setShift(position);

                            const operation = materialArtVersioningSystem.createPrimaryOperation();
                            operation.newArts(cubeArt);
                            operation.persist();

                            console.log({ cubeArt });

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    async next(touchFrame) {
                                        /*
                                        TODO: !!! Only unique on grid
                                        TODO: !!! Removing

                                        const cubeArt = new CubeArt(
                                            (await collSpace.pickPoint(touchFrame.position)).point,
                                            attributesSystem.getAttributeValue('color') as string,
                                        );

                                        const operation = materialArtVersioningSystem.createPrimaryOperation();
                                        operation.newArts(cubeArt);
                                        operation.persist();

                                        console.log({ cubeArt });

                                        */
                                    },
                                    complete() {},
                                }),
                            );
                        },
                    }),
                );
            },
        },
    }),
);
