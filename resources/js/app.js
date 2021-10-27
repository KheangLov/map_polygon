/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue').default;


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import MarkerClusterer from '@googlemaps/markerclustererplus';

const { Loader } = require('google-maps');

const loader = new Loader('AIzaSyDil3fAJv-TSSv2OMEIu2fPl7bMfc8x5a0', {
    libraries: ['drawing', 'geometry']
});

new Vue({
    el: '#app',
    data() {
        return {
            markers: [],
            map: {},
            drawingManager: {},
            selectedType: 0,
            polygonTypes: [
                {
                    text: 'Default',
                    value: 0,
                },
                {
                    text: 'Lat, Lng',
                    value: 1,
                },
                {
                    text: 'Lat Lng,',
                    value: 2,
                },
                {
                    text: 'Lng, Lat',
                    value: 3,
                },
                {
                    text: 'Lng Lat,',
                    value: 4,
                },
                {
                    text: '[Lng, Lat]',
                    value: 5,
                },
                {
                    text: '[Lat, Lng]',
                    value: 6,
                },
            ],
            displayData: '',
            polygon: [],
            importedData: '',
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            windowPath: '',
            formData: [],
        };
    },
    async created() {
        await this.loadGoogle();
        this.mapInit();
    },
    methods: {
        submit() {
            axios.post('/submit', data)
                .then(res => window.location.reload());
        },
        review(url = '/review') {
            axios.get(url)
                .then(async ({ data: { data: { data, next_page_url } } }) => {
                    await data.forEach(({ let: lat, long }) => {
                        const marker = new google.maps.Marker({
                            position: new google.maps.LatLng(lat, long),
                            map: this.map,
                            draggable: true
                        });
                        this.markers.push(marker);
                    });

                    this.addCluster();
                    if (next_page_url) {
                        this.review(next_page_url);
                    }
                });
        },
        addCluster() {
            if (this.markers.length) {
                const markerCt = new MarkerClusterer(
                    this.map,
                    this.markers,
                    {
                        imagePath: this.imagePath
                    }
                );
                markerCt.setIgnoreHidden(true);
            }
        },
        importData() {
            this.drawPolygon(this.importedData.split(/\r?\n/).filter(v => v).map(v => {
                const latLng = v.split(',');
                return new google.maps.LatLng(latLng[1], latLng[0]);
            }));
            this.$set(this, 'importedData', '');
        },
        async loadGoogle() {
            window.google = await loader.load();
        },
        mapInit() {
            this.$set(this, 'map', new google.maps.Map(document.getElementById("map_property"), {
                center: { lat: 12.3417719, lng: 105.2355957 },
                zoom: 7,
            }));
            if (this.windowPath == 'draw') this.drawingTool();

            if (this.windowPath == 'form')
                this.map.addListener('click', ({ latLng }) => {
                    this.formData.push({
                        let: latLng.lat(),
                        long: latLng.lng()
                    });
                    new google.maps.Marker({
                        position: latLng,
                        map: this.map,
                        draggable: true
                    });
                });
        },
        formatData() {
            let paths = this.polygon.getPath().getArray();

            switch (this.selectedType) {
                case 1:
                    paths = paths.map(path => `${path.lat()}, ${path.lng()}`).join('\n');
                    break;
                case 2:
                    paths = paths.map(path => `${path.lat()} ${path.lng()},`).join('\n');
                    break;
                case 3:
                    paths = paths.map(path => `${path.lng()}, ${path.lat()}`).join('\n');
                    break;
                case 4:
                    paths = paths.map(path => `${path.lng()} ${path.lat()},`).join('\n');
                    break;
                case 5:
                    paths = paths.map(path => [path.lng(), path.lat()]);
                    break;
                case 6:
                    paths = paths.map(path => [path.lat(), path.lng()]);
                    break;
                default:
                    break;
            }

            this.$set(this, 'displayData', paths);
        },
        copyLatLng(e) {
            const element = $(e.target);
            const temp = $("<input>");
            $("body").append(temp);
            temp.val(element.text()).select();
            document.execCommand("copy");
            temp.remove();
            element.popover({
                content: 'Copied',
                placement: 'bottom',
            });
            element.popover("show");
            setTimeout(() => element.popover("hide"), 2000);
        },
        drawingTool() {
            const vm = this;
            this.$set(this, 'drawingManager', new google.maps.drawing.DrawingManager({
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                }
            }));

            this.drawingManager.setMap(this.map);
            google.maps.event.addListener(this.drawingManager, "overlaycomplete", event => {
                const paths = event.overlay;
                vm.drawPolygon(paths.getPath().getArray());
                paths.setMap(null);
            });
        },
        drawPolygon(paths) {
            const vm = this;
            const polygon = new google.maps.Polygon({
                paths,
                strokeColor: "#ff0000",
                strokeOpacity: 1,
                strokeWeight: 5,
                fillOpacity: 0,
                editable: true,
            });
            polygon.setMap(vm.map);
            vm.$set(vm, 'polygon', polygon);
            vm.formatData();
            google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
                vm.$set(vm, 'polygon', polygon);
                vm.formatData();
            });
            google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
                vm.$set(vm, 'polygon', polygon);
                vm.formatData();
            });
            vm.drawingManager.setMap(null);
        }
    },
    mounted() {
        this.$set(this, 'windowPath', window.location.pathname.split('/')[1]);
        if (this.windowPath == 'getform') this.review();
    }
});
