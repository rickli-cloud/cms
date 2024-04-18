<script lang="ts">
  import { daysInMonth } from "$lib/utils/time";


  /** Last x months */
  export let span: number = 12

  const currentYear = new Date().getUTCFullYear()
  const currentMonth = new Date().getUTCMonth()
  console.log({ currentMonth, currentYear })

  const months: { y: number, m: number }[] = []

  for (let i = span - 1; i >= 0; i--) {
    const monthOffset = currentMonth - i
    const yearOffset = Math.ceil(monthOffset / 12) - 1

    months.push({
      y: monthOffset > 0 ? currentYear : currentYear + yearOffset,
      m: monthOffset > 0 ? monthOffset : monthOffset - (yearOffset * 12)
    })
  }

  function daysArray(days: number): number[] {
    const daysArray: number[] = []
    for (let i = 0; i < days; i++) {
      daysArray.push(i)
    }
    return daysArray
  }

  console.log(months)
</script>

<div class="overflow-x-scroll min-h-[100px] flex flex-col-reverse">
  <div class="activity-grid">
    {#each months as { y, m }}
    {#each daysArray(daysInMonth(y, m)) as d}
      <div>{d + 1}.{m}</div>
    {/each}
    {/each}
  </div>
</div>

<style lang="postcss" scoped>
.activity-grid {
  @apply grid gap-1 mx-1;


  grid-template-columns: repeat(auto-fill, 0.625rem);
  grid-template-rows: repeat(6, 0.625rem);
  grid-auto-flow: column;
  
  & > div {
    @apply h-3 w-3 border rounded-[2px] text-[5px] text-center bg-muted;
  }
}
</style>

