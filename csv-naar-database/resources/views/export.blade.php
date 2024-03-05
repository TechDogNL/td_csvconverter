<style>
    table {
        background-color: lightblue; /* Set the background color of the table */
    }
</style>


<h1>CSV File Contents</h1>

@if (!empty($contents))
    <table border="1" color="red">
        <tr>
            <th>Eerste product regel</th>  {{--  dit kunnen veranderen naar de header van het bestand--}}
            <th>Column 2</th> 
            <th>Column 3</th>
        </tr>
        @foreach ($contents as $row)
            <tr>
                <td><input type="radio" name="selected" value="{{ $loop->iteration  }}"> </td>
                <td>{{ $row[0] }}</td>
                <td>{{ $row[1] }}</td>
            </tr>
        @endforeach
    </table>
    <button type="submit">Opsturen naar database</button>
@else
    <p>No data found.</p>
@endif

<script>
  
</script>

