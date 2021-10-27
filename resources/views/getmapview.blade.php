@extends('layout')
@section('content')
    <div id="map_property" style="height:500px"></div>
@endsection
@push('after_script')
    <script src="https://maps.googleapis.com/maps/api/js"></script>
    <script src="https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script type="text/javascript">
        let data = [];
        const latLng = new google.maps.LatLng(11.5760393, 104.9230512);
        const map = new google.maps.Map(document.getElementById("map_property"), {
            center: latLng,
            zoom: 8,
        });
        let markers = [];

        function review(url = '{{ url("/review") }}') {
            axios.get(url)
                .then(async ({ data: { data: { data, next_page_url } } }) => {
                    await data.forEach(({ let, long }) => {
                        const marker = new google.maps.Marker({
                            position: new google.maps.LatLng(let, long),
                            map,
                            draggable: true
                        });
                        markers.push(marker);
                    });

                    addCluster();
                    if (next_page_url) {
                        review(next_page_url);
                    }
                });
        }
        review();

        function addCluster() {
            if (markers.length) {
                const markerCt = new MarkerClusterer(
                    map,
                    markers,
                    {
                        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                    }
                );
                markerCt.setIgnoreHidden(true);
            }
        }

    </script>
@endpush
