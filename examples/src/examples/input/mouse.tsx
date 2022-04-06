import * as pc from '../../../../';


class MouseExample {
    static CATEGORY = 'Input';
    static NAME = 'Mouse';


    example(canvas: HTMLCanvasElement): void {
        // Create the application and start the update loop
        const app = new pc.Application(canvas, {});

        const assets = {
            'statue': new pc.Asset('statue', 'container', { url: '/static/assets/models/statue.glb' })
        };

        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
        assetListLoader.load(() => {
            app.start();

            app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

            // Create an Entity with a camera component
            const camera = new pc.Entity();
            camera.addComponent("camera", {
                clearColor: new pc.Color(0.4, 0.45, 0.5)
            });
            camera.translate(0, 7, 25);
            app.root.addChild(camera);

            // Create an Entity with a omni light component and a sphere model component.
            const light = new pc.Entity();
            light.addComponent("light", {
                type: "omni",
                color: new pc.Color(1, 1, 1),
                range: 100
            });
            light.translate(5, 5, 10);
            app.root.addChild(light);

            const entity = assets.statue.resource.instantiateRenderEntity();
            app.root.addChild(entity);

            const mouse = new pc.Mouse(document.body);

            let x = 0;
            const y = 0;

            mouse.on('mousemove', function (event) {
                if (event.buttons[pc.MOUSEBUTTON_LEFT]) {
                    x += event.dx;

                    entity.setLocalEulerAngles(0.2 * y, 0.2 * x, 0);
                }
            });
        });
    }
}

export default MouseExample;
