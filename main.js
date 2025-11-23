import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, -8);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


class Texture_Rotate {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {    
            // TODO: 2.c Rotate the texture map around the center of each face at a rate of 8 rpm.
            // rotate UV coordinates about the center (0.5,0.5)
            float PI = 3.141592653589793;
            float angle = animation_time * (-4.0 * PI / 15.0);
            vec2 center = vec2(0.5, 0.5);
            vec2 uv = vUv - center;
            vec2 rotated_uv = vec2(uv.x * cos(angle) - uv.y * sin(angle), uv.x * sin(angle) + uv.y * cos(angle)) + center;

            // TODO: 1.b Load the texture color from the texture map
            // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
            vec4 tex_color = texture2D(uTexture, rotated_uv);
            
            // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
            // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
            //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
            vec2 local_uv = fract(rotated_uv);           
            vec2 delta = abs(local_uv - vec2(0.5));         // distance from face center
            float inner_half = 0.25;                        // 0.5 radius -> 0.25 from center
            float outer_half = 0.35;                        // 0.7 radius -> 0.35 from center
            float max_delta = max(delta.x, delta.y);        // square bounds via max component
            bool within_outer = max_delta <= outer_half;
            bool outside_inner = max_delta >= inner_half;
            if (within_outer && outside_inner) {         
                tex_color = vec4(0.0, 0.0, 0.0, 1.0);
            }

            gl_FragColor = tex_color;
        }
        `;
    }
}


class Texture_Scroll_X {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            // TODO: 2.a Shrink the texture by 50% so that the texture is repeated twice in each direction
            vec2 uv = vUv * 2.0;


            // TODO: 2.b Translate the texture varying the s texture coordinate by 4 texture units per second, 
            uv.x = uv.x + animation_time * -4.0;  // left to right


            // TODO: 1.b Load the texture color from the texture map
            // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
            vec4 tex_color = texture2D(uTexture, uv);


            // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
            // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
            //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
            vec2 local_uv = fract(uv);           
            vec2 delta = abs(local_uv - vec2(0.5));         // distance from face center
            float inner_half = 0.25;                        // 0.5 radius -> 0.25 from center
            float outer_half = 0.35;                        // 0.7 radius -> 0.35 from center
            float max_delta = max(delta.x, delta.y);        // square bounds via max component
            bool within_outer = max_delta <= outer_half;
            bool outside_inner = max_delta >= inner_half;
            if (within_outer && outside_inner) {         
                tex_color = vec4(0.0, 0.0, 0.0, 1.0);
            }

            gl_FragColor = tex_color;
        }
        `;
    }
}

let animation_time = 0.0;

const cube1_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
const cube1_texture = new THREE.TextureLoader().load('assets/stars.png');

// TODO: 1.c Apply Texture Filtering Techniques to Cube 1
// Nearest Neighbor Texture Filtering
// e.g. cube1_texture.minFilter = ...
cube1_texture.minFilter = THREE.NearestFilter;
cube1_texture.magFilter = THREE.NearestFilter;


// TODO: 2.a Enable texture repeat wrapping for Cube 1
cube1_texture.wrapS = THREE.RepeatWrapping;
cube1_texture.wrapT = THREE.RepeatWrapping;

const cube1_uniforms = {
    uTexture: { value: cube1_texture },
    animation_time: { value: animation_time }
};
const cube1_shader = new Texture_Rotate();
const cube1_material = new THREE.ShaderMaterial({
    uniforms: cube1_uniforms,
    vertexShader: cube1_shader.vertexShader(),
    fragmentShader: cube1_shader.fragmentShader(),
});

const cube1_mesh = new THREE.Mesh(cube1_geometry, cube1_material);
cube1_mesh.position.set(2, 0, 0)
scene.add(cube1_mesh);

const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
const cube2_texture = new THREE.TextureLoader().load('assets/earth.gif');;

// TODO: 1.c Apply Texture Filtering Techniques to Cube 2
// Linear Mipmapping Texture Filtering
// e.g. cube2_texture.minFilter = ...
cube2_texture.minFilter = THREE.LinearMipMapLinearFilter;
cube2_texture.magFilter = THREE.LinearFilter;


// TODO: 2.a Enable texture repeat wrapping for Cube 2
cube2_texture.wrapS = THREE.RepeatWrapping;
cube2_texture.wrapT = THREE.RepeatWrapping;


const cube2_uniforms = {
    uTexture: { value: cube2_texture },
    animation_time: { value: animation_time }
};
const cube2_shader = new Texture_Scroll_X();
const cube2_material = new THREE.ShaderMaterial({
    uniforms: cube2_uniforms,
    vertexShader: cube2_shader.vertexShader(),
    fragmentShader: cube2_shader.fragmentShader(),
});

const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
cube2_mesh.position.set(-2, 0, 0)
scene.add(cube2_mesh);

const clock = new THREE.Clock();
let animation_enabled = false;

// rotation rates in radians per second
const cube1_rot_speed = (15.0 * Math.PI * 2.0) / 60.0; // 15 rpm around X
const cube2_rot_speed = (40.0 * Math.PI * 2.0) / 60.0; // 40 rpm around Y

function animate() {
    controls.update();

    // TODO: 2.b&2.c Update uniform values
    // e.g. cube1_uniforms.animation_time.value = ...
    const delta = clock.getDelta();
    animation_time += delta;
    cube1_uniforms.animation_time.value = animation_time;
    cube2_uniforms.animation_time.value = animation_time;

    // TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
    // Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
    // Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    if (animation_enabled) {
        cube1_mesh.rotation.x -= cube1_rot_speed * delta;
        cube2_mesh.rotation.y += cube2_rot_speed * delta;
    }


    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes
window.addEventListener('keydown', onKeyPress);
function onKeyPress(event) {
    switch (event.key) {
        case 'c':
        case 'C':
            animation_enabled = !animation_enabled;
            break;
    }
}
