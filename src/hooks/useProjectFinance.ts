import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ProjectFinanceSummary {
  project_id: string;
  project_code: string;
  project_name: string;
  contract_value: number;
  total_costs: number;
  total_revenue: number;
  total_expenses: number;
  receivable: number;
  payable: number;
  margin: number;
  margin_percent: number;
}

export function useProjectFinance(projectId?: string) {
  return useQuery({
    queryKey: ['project-finance', projectId],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      // Get projects with their financial data
      let projectQuery = supabase
        .from('projects')
        .select('id, code, name, contract_value')
        .order('created_at', { ascending: false });

      if (projectId) {
        projectQuery = projectQuery.eq('id', projectId);
      }

      const { data: projects, error: projectError } = await projectQuery;
      if (projectError) throw projectError;

      // Get costs for all projects
      const { data: costs, error: costsError } = await supabase
        .from('project_costs')
        .select('project_id, amount, status');
      if (costsError) throw costsError;

      // Get payments for all projects
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('project_id, amount, direction, status');
      if (paymentsError) throw paymentsError;

      // Calculate summary for each project
      const summaries: ProjectFinanceSummary[] = projects.map((project) => {
        const projectCosts = costs.filter((c) => c.project_id === project.id);
        const projectPayments = payments.filter((p) => p.project_id === project.id);

        const total_costs = projectCosts
          .filter((c) => c.status !== 'rejected')
          .reduce((sum, c) => sum + Number(c.amount), 0);

        const total_revenue = projectPayments
          .filter((p) => p.direction === 'in' && p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const total_expenses = projectPayments
          .filter((p) => p.direction === 'out' && p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const receivable = Number(project.contract_value) - total_revenue;
        const payable = total_costs - total_expenses;
        const margin = Number(project.contract_value) - total_costs;
        const margin_percent = project.contract_value > 0 
          ? (margin / Number(project.contract_value)) * 100 
          : 0;

        return {
          project_id: project.id,
          project_code: project.code,
          project_name: project.name,
          contract_value: Number(project.contract_value),
          total_costs,
          total_revenue,
          total_expenses,
          receivable,
          payable,
          margin,
          margin_percent,
        };
      });

      return summaries;
    },
  });
}
