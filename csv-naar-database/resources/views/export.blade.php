<style>
    table {
        background-color: lightblue; 
    }
</style>


<h1>CSV File Inhoud</h1>

@if (!empty($contents))
<form action="add" method="POST">
    @csrf
    <table border="1" color="red">
        <tr>
            <th>Eerste product regel</th>  {{--  dit kunnen veranderen naar de header van het bestand--}}
            @foreach ($contents[0] as $header )
                <th>{{ $header }}</th>
            @endforeach
        </tr>
        @foreach ($contents as $row)
        <tr>
            <td><input type="radio" name="selected" value="{{ $loop->iteration  }}"> </td>
            @foreach ($row as $cell)
                <td>{{ $cell }}</td>
                <input type="hidden" name="name[]" value="{{ $cell }}">
            @endforeach
        </tr>
    @endforeach
    </table>
    <button type="submit">Opsturen naar database</button>
</form>
@else
    <p>No data found.</p>
@endif

<script>
  
</script>

