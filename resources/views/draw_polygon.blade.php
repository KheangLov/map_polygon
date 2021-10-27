
@extends('layout')
@section('content')
    <div class="row">
        <div class="col-md-8 p-0">
            <div id="map_property"></div>
        </div>
        <div class="col-md-4 p-0 bg-white">
            <div class="card border-0">
                <div class="card-body">
                    <div class="mb-3">
                        <h2 class="text-dark font-weight-bold">Polygon</h2>
                        <select
                            class="form-control"
                            v-model="selectedType"
                            :disabled="polygon.length"
                            @change="formatData()"
                        >
                            <option
                                v-for="({ text, value }, i) in polygonTypes"
                                :value="value"
                                :key="i"
                            >@{{ text }}</option>
                        </select>
                    </div>
                    <div class="mt-2 overflow-auto height-35vh bg-custom px-4 py-3 rounded">
                        <pre
                            v-html="displayData"
                            @click="copyLatLng($event)"
                        ></pre>
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between mb-2">
                            <div>
                                <h4 class="font-weight-bold text-dark">Import</h4>
                            </div>
                            <div>
                                <button
                                    class="btn btn-sm btn-secondary"
                                    @click="importData"
                                >
                                    Import
                                </button>
                            </div>
                        </div>
                        <textarea
                            v-model="importedData"
                            rows="9"
                            class="form-control"
                            placeholder="lng,lat&#10;lng,lat&#10;lng,lat..."
                        >
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
