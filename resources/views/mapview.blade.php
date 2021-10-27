@extends('layout')
@section('content')
    <div id="map_property" style="height:500px"></div>
@endsection
@push('after_script')
    <script src="https://maps.googleapis.com/maps/api/js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script type="text/javascript">
        let data = [];
        const latLng = new google.maps.LatLng(11.5760393, 104.9230512);
        const map = new google.maps.Map(document.getElementById("map_property"), {
            center: latLng,
            zoom: 16,
        });
        map.addListener('click', ({ latLng }) => {
            data.push({
                let: latLng.lat(),
                long: latLng.lng()
            });
            // document.getElementById('input_data').value =
            const marker = new google.maps.Marker({
                position: latLng,
                map,
                draggable: true
            });
        });

        function sumit() {
            axios.post('{{ url("/submit") }}', data)
                .then(res => window.location.reload());
        }

    </script>
@endpush
