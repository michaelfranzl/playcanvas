import React from 'react';
import * as pc from '../../../../';
import { Button } from '@playcanvas/pcui/react';
import { Observer } from '@playcanvas/observer';

class UsdzExportExample {
    static CATEGORY = 'Loaders';
    static NAME = 'USDZ Export';

    controls(data: Observer) {
        return <>
            <Button text='Download USDZ' onClick={() => data.emit('download')}/>
        </>;
    }

    example(canvas: HTMLCanvasElement, deviceType: string, pcx: any, data: any): void {

        // Create the app and start the update loop
        const app = new pc.Application(canvas, {});

        const assets = {
            'helipad.dds': new pc.Asset('helipad.dds', 'cubemap', { url: '/static/assets/cubemaps/helipad.dds' }, { type: pc.TEXTURETYPE_RGBM }),
            'bench': new pc.Asset('bench', 'container', { url: '/static/assets/models/bench_wooden_01.glb' })
        };

        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
        assetListLoader.load(() => {

            // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
            app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);

            app.start();

            // get the instance of the bench and set up with render component
            const entity = assets.bench.resource.instantiateRenderEntity();
            app.root.addChild(entity);

            // Create an Entity with a camera component
            const camera = new pc.Entity();
            camera.addComponent("camera", {
                clearColor: new pc.Color(0.2, 0.1, 0.1),
                farClip: 100
            });
            camera.translate(-3, 1, 2);
            camera.lookAt(0, 0.5, 0);
            app.root.addChild(camera);

            // set skybox
            app.scene.setSkybox(assets["helipad.dds"].resources);
            app.scene.toneMapping = pc.TONEMAP_ACES;
            app.scene.skyboxMip = 1;

            // a link element, created in the html part of the examples.
            const link = document.getElementById('ar-link');

            // convert the loaded entity into asdz file
            const options = {
                maxTextureSize: 1024
            };

            new pcx.UsdzExporter().build(entity, options).then((arrayBuffer: any) => {
                const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

                // On iPhone Safari, this link creates a clickable AR link on the screen. When this is clicked,
                // the download of the .asdz file triggers its opening in QuickLook AT mode.
                // In other browsers, this simply downloads the generated .asdz file.

                // @ts-ignore
                link.download = "bench.usdz";

                // @ts-ignore
                link.href = URL.createObjectURL(blob);
            }).catch(console.error);

            // when clicking on the download UI button, trigger the download
            data.on('download', function () {
                link.click();
            });

            // spin the meshe
            app.on("update", function (dt) {
                if (entity) {
                    entity.rotate(0, -12 * dt, 0);
                }
            });
        });
    }
}

export default UsdzExportExample;
