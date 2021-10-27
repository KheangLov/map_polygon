@extends('layout')
@section('content')
    <div class="row">
        <div class="col-12 p-0">
            <button
                class="btn btn-light position-absolute font-weight-bold shadow"
                style="z-index: 10000; bottom: 30px; left: 10px;"
            >
                Submit
            </button>
            <div id="map_property"></div>
        </div>
    </div>
@endsection
