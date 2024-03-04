<h1>CSV File Contents</h1>

@if (!empty($contents))
    <table border="1">
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
        </tr>
        @foreach ($contents as $row)
            <tr>
                <td>{{ $row[0] }}</td>
                <td>{{ $row[1] }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p>No data found.</p>
@endif