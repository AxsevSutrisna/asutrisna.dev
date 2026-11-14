/**
 * Map array baris DB (nullable) menjadi array entity domain.
 * Helper kecil dipakai oleh repository di `fetchAll`/`list`.
 */
export function mapRows<Row, Entity>(
  rows: Row[] | null | undefined,
  mapper: (row: Row) => Entity
): Entity[] {
  return (rows ?? []).map(mapper)
}
