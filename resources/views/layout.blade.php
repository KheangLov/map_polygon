<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @stack('before_style')
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @stack('after_style')
</head>
<body>
    <div class="container-fluid" id="app">
        @yield('content')
    </div>

    @stack('before_script')
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('after_script')
</body>
</html>
